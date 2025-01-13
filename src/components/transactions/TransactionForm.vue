<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts';
import { useCategoriesStore } from '@/stores/categories';
import type { Transaction } from '@/types';
import moment from 'moment';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
    initialData?: Partial<Transaction>;
    transactionDialog: boolean;
}>();

const emit = defineEmits<{
    submit: [transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>];
    cancel: [];
}>();

const accountsStore = useAccountsStore();
const categoriesStore = useCategoriesStore();

const date = ref(props.initialData?.date ?? new Date().toISOString().split('T')[0]);
const description = ref(props.initialData?.description ?? '');
const amount = ref(props.initialData?.amount?.toString() ?? '0');
const accountId = ref(props.initialData?.account_id ?? '');
const categoryId = ref(props.initialData?.category_id ?? '');
const details = ref(props.initialData?.details ?? '');

const category = ref();
const visible = ref(false);

const categories = computed(() => categoriesStore.categories);

onMounted(async () => {
    if (accountsStore.accounts.length === 0) {
        await accountsStore.fetchAccounts();
    }
    if (categoriesStore.categories.length === 0) {
        await categoriesStore.fetchCategories();
    }
});

function handleSubmit() {
    emit('submit', {
        date: moment(date.value, 'DD/MM/YYYY').format('DD/MM/YYYY'), //new Date(date.value).toISOString(),
        description: description.value,
        amount: parseFloat(amount.value),
        account_id: accountId.value,
        category_id: categoryId.value,
        details: details.value || undefined
    });
}

watch([props], () => {
    visible.value = props.transactionDialog;
});
</script>

<template>
    <Dialog v-model:visible="visible" :style="{ width: '450px' }" header="Product Details" :modal="true">
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <DatePicker :manualInput="false" iconDisplay="input" showIcon showButtonBar v-model="date" dateFormat="dd/mm/yyyy" fluid></DatePicker>
            <!-- <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="" /> -->
            <!-- <Input v-model="date" type="date" required /> -->

            <InputText v-model="description" type="text" placeholder="" required />
            <!-- <Input v-model="description" placeholder="Description" required /> -->

            <InputText v-model="amount" type="number" step="0.01" placeholder="" required />
            <!-- <Input v-model="amount" type="number" step="0.01" placeholder="Amount" required /> -->

            <!-- <select v-model="accountId" required class="form-input">
                <option value="">Select an account</option>
                <option v-for="account in accountsStore.accounts" :key="account.id" :value="account.id">
                    {{ account.name }}
                </option>
            </select> -->

            <Select v-model="category" :options="categories" optionLabel="name" style="min-width: 14rem">
                <template #option="slotProps">
                    <span>{{ slotProps.option.name }}</span>
                </template>
            </Select>
            <!-- <select v-model="categoryId" required class="form-input">
                <option value="">Select a category</option>
                <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select> -->

            <Textarea v-model="details" rows="3" placeholder="Additional details"></Textarea>

            <div class="flex justify-end gap-2">
                <Button type="button" severity="danger" @click="emit('cancel')"> Cancel </Button>
                <Button type="submit" severity="success"> Save Transaction </Button>
            </div>
        </form>
    </Dialog>
</template>
