<script setup lang="ts">
import type { Category } from '@/types';
import { computed, ref, watch } from 'vue';
import IconViewer from '../IconViewer.vue';

const props = defineProps<{
    initialData?: Partial<Category>;
    categoryDialog: boolean;
}>();

const emit = defineEmits<{
    submit: [category: Omit<Category, 'id' | 'created_at' | 'user_id'>];
    cancel: [];
}>();

const categoryId = ref(props.initialData?.id ?? '');
const description = ref(props.initialData?.name ?? '');
const color = ref(props.initialData?.color ?? '#000');
const icon = ref(props.initialData?.icon ?? '');
const visible = ref(false);
const op = ref();

const iconStyleObject = computed(() => {
    return {
        fontSize: '2.5rem',
        color: color.value.startsWith('#') ? color.value : '#' + color.value,
        cursor: 'pointer'
    };
});

const toggle = (event) => {
    op.value.toggle(event);
};

const selectIcon = (selectedIcon: string) => {
    icon.value = selectedIcon;
    op.value.hide();
};

const onFormSubmit = ({ valid }) => {
    if (valid) {
        let category: Omit<Category, 'id' | 'created_at' | 'user_id'> = {
            name: description.value,
            color: color.value,
            icon: icon.value
        };

        if (categoryId.value !== '') {
            category.id = categoryId.value;
        }

        emit('submit', category);
    }
};

watch([props], () => {
    visible.value = props.categoryDialog;
    categoryId.value = props.initialData?.id ?? '';
    description.value = props.initialData?.name ?? '';
    color.value = props.initialData?.color ?? '#000';
    icon.value = props.initialData?.icon ?? '';

    initialValues.value = {
        description: description.value,
        color: color.value,
        icon: icon.value
    };
});

const initialValues = ref({
    description: description.value,
    color: color.value,
    icon: icon.value
});

const resolver = ({ values }) => {
    const errors = { description: [], color: [], icon: [] };

    if (!values.description) {
        errors.description.push({ type: 'required', message: 'Name is required.' });
    }

    if (!values.color) {
        errors.color.push({ type: 'required', message: 'Color is required.' });
    }

    if (!values.icon || values.amount <= 0) {
        errors.icon.push({ type: 'required', message: 'Icon is required.' });
    }

    return {
        errors
    };
};
</script>

<template>
    <Dialog v-model:visible="visible" :style="{ width: '450px' }" header="Category" :modal="true">
        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="space-y-4">
            <div class="card flex flex-col gap-4 w-full py-2">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <FloatLabel variant="on" class="w-full">
                            <label for="description_id">Description</label>
                            <InputText id="description_id" name="description" class="w-full" v-model="description" type="text" />
                        </FloatLabel>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <InputGroup>
                            <FloatLabel variant="on">
                                <label for="color_id">Color</label>
                                <InputText id="color_id" name="color" :model-value="color.startsWith('#') ? color : '#' + color" class="!w-6/12"> </InputText>
                            </FloatLabel>
                            <InputGroupAddon>
                                <ColorPicker v-model="color" inputId="cp-hex" format="hex" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <div class="flex items-center gap-2">
                            <label for="icon_id">Icon</label>
                            <i :class="icon" name="icon" id="icon_id" style="font-size: 2.5rem" :style="iconStyleObject" @click="toggle" />
                            <Popover ref="op">
                                <IconViewer class="" @icon-selected="selectIcon($event)"></IconViewer>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-2">
                    <Button severity="secondary" label="Cancel" icon="pi pi-times" @click="emit('cancel')"></Button>
                    <Button severity="success" label="Save" type="submit" icon="pi pi-check"></Button>
                </div>
            </div>
        </Form>
    </Dialog>
</template>
