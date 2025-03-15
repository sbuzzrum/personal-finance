<script setup lang="ts">
import CategoryForm from '@/components/categories/CategoryForm.vue';
import { useCategoriesStore } from '@/stores/categories';
import { Category } from '@/types';
import { useConfirm } from 'primevue/useconfirm';
import { computed, onMounted, ref } from 'vue';

const confirm = useConfirm();

const categoriesStore = useCategoriesStore();

const categories = computed(() => categoriesStore.categories);

const options = ref(['list', 'grid']);
const layout = ref('list');
const editingCategory = ref<Partial<Category | null>>(null);
const viewCategoryDialog = ref(false);
const loading = computed(() => categoriesStore.isLoading);

onMounted(() => {
    categoriesStore.fetchCategories();
});

const handleEdit = (category: Category) => {
    viewCategoryDialog.value = true;
    editingCategory.value = category;
};

const handleDelete = async (category: Category) => {
    await categoriesStore.deleteCategory(category.id);
};

const handleSubmit = async (category: Partial<Category>) => {
    viewCategoryDialog.value = false;
    editingCategory.value = null;
    if (!category.id) {
        await categoriesStore.createCategory(category);
    } else {
        await categoriesStore.updateCategory(category.id, category);
    }
};

const confirmDelete = (category: Category) => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            handleDelete(category);
        },
        reject: () => {}
    });
};

const handleCancel = () => {
    viewCategoryDialog.value = false;
    editingCategory.value = null;
};

const items = ref([
    {
        label: 'Add',
        icon: 'pi pi-pencil',
        command: () => {
            alert('clicked');
        }
    }
]);

const myToggleCallback = () => {
    editingCategory.value = { name: '', color: '#000000', icon: 'icomoon-Soldi_Risorsa-43' };
    viewCategoryDialog.value = true;
};

const progressStyle = computed(() => {
    return {
        position: 'absolute',
        zIndex: 9999,
        left: '0px',
        top: '0px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    };
});
</script>
<template>
    <ConfirmDialog></ConfirmDialog>
    <ProgressSpinner v-show="loading" class="overlay" />
    <BlockUI :blocked="loading" :fullScreen="true">
        <div class="card">
            <CategoryForm :category-dialog="viewCategoryDialog" :initial-data="editingCategory" @cancel="handleCancel()" @submit="handleSubmit($event)" />
            <DataView :value="categories" :layout="layout" :paginator="layout === 'list'" :rows="10">
                <template #header>
                    <div class="flex justify-end">
                        <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                            <template #option="{ option }">
                                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                            </template>
                        </SelectButton>
                    </div>
                </template>
                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-2 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                                <div class="flex flex-col md:w-40 relative rounded-icon !size-20 !text-4xl justify-center items-center">
                                    <i :class="item.icon" :style="'color: ' + (item.color.startsWith('#') ? item.color : '#' + item.color) + ';'" />
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                            <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                                        </div>
                                        <div class="">
                                            <div class="flex items-center gap-2 justify-center">
                                                <Tag :value="'Transactions: ' + item.transactions.length" :severity="item.transactions.length > 0 ? 'success' : 'danger'" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <Button severity="success" icon="pi pi-pencil" label="Edit" @click="handleEdit(item)" class="flex-auto md:flex-initial whitespace-nowrap"></Button>
                                            <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete(item)" class="flex-auto whitespace-nowrap" :disabled="item.transactions.length > 0"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="grid grid-cols-12 gap-4">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 md:col-span-4 lg:col-span-2 p-2">
                            <div class="p-4 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col" style="height: 270px">
                                <div class="flex justify-center p-2">
                                    <div class="flex flex-col rounded-icon !size-20 !text-5xl justify-center items-center relative mx-auto">
                                        <i :class="item.icon" :style="'color: ' + (item.color.startsWith('#') ? item.color : '#' + item.color) + ';'" />
                                    </div>
                                </div>
                                <div class="pt-2 flex flex-col justify-between flex-1">
                                    <div class="flex flex-row justify-center items-start gap-2 text-pretty text-center">
                                        <div class="text-lg font-medium mt-1">{{ item.name }}</div>
                                    </div>
                                    <div class="flex flex-col gap-6 mt-2">
                                        <div class="flex items-center gap-2 justify-center">
                                            <Tag :value="'Transactions: ' + item.transactions.length" :severity="item.transactions.length > 0 ? 'success' : 'danger'" />
                                        </div>
                                        <div class="flex gap-2">
                                            <Button severity="success" icon="pi pi-pencil" label="Edit" @click="handleEdit(item)" class="flex-auto whitespace-nowrap"></Button>
                                            <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete(item)" class="flex-auto whitespace-nowrap" :disabled="item.transactions.length > 0"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <SpeedDial direction="up" :model="items" class="bottom-0 right-0 mb-3 mr-3" buttonClass="shadow-5" :style="{ position: 'fixed', right: '1rem', bottom: '1rem' }" :pt="{ action: { class: 'shadow-5' } }">
            <template #button="{ toggleCallback }">
                <Button icon="pi pi-plus" class="p-button-rounded p-button-success p-button-lg" @click="myToggleCallback()" />
            </template>
        </SpeedDial>
    </BlockUI>
</template>

<style scoped lang="css">
.overlay {
    position: fixed !important;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    z-index: 9999; /* this seems to work for me but may need to be higher*/
}
</style>
