<script setup lang="ts">
import type { Totalizer } from '@/types';
import { ref, watch } from 'vue';

const props = defineProps<{
    initialData?: Partial<Totalizer>;
    totalizerDialog: boolean;
}>();

const emit = defineEmits<{
    submit: [totalizer: Omit<Totalizer, 'id' | 'created_at' | 'user_id'>];
    cancel: [];
}>();

const totalizerId = ref(props.initialData?.id ?? '');
const name = ref(props.initialData?.name ?? '');
const description = ref(props.initialData?.description ?? '');
const visible = ref(false);

const onFormSubmit = ({ valid }) => {
    if (valid) {
        let totalizer: Omit<Totalizer, 'id' | 'created_at' | 'user_id'> = {
            name: name.value,
            description: description.value
        };

        if (totalizerId.value !== '') {
            totalizer.id = totalizerId.value;
        }

        emit('submit', totalizer);
    }
};

watch([props], () => {
    visible.value = props.totalizerDialog;
    totalizerId.value = props.initialData?.id ?? '';
    name.value = props.initialData?.name ?? '';
    description.value = props.initialData?.description ?? '';

    initialValues.value = {
        name: name.value,
        description: description.value
    };
});

const initialValues = ref({
    name: name.value,
    description: description.value
});

const resolver = ({ values }) => {
    const errors = { name: [], description: [] };

    if (!values.name) {
        errors.name.push({ type: 'required', message: 'Name is required.' });
    }

    if (!values.description) {
        errors.description.push({ type: 'required', message: 'Description is required.' });
    }

    return {
        errors
    };
};
</script>

<template>
    <Dialog v-model:visible="visible" :style="{ width: '450px' }" header="Totalizer" :modal="true">
        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="space-y-4">
            <div class="card flex flex-col gap-4 w-full py-2">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <FloatLabel variant="on" class="w-full">
                            <label for="name_id">Name</label>
                            <InputText id="name_id" name="name" class="w-full" v-model="name" type="text" />
                        </FloatLabel>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <FloatLabel variant="on" class="w-full">
                            <label for="description_id">Description</label>
                            <InputText id="description_id" name="description" class="w-full" v-model="description" type="text" />
                        </FloatLabel>
                    </div>
                </div>
                <!-- <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <div class="flex items-center gap-2">
                            <label for="description_id">Icon</label>
                            <i :class="icon" name="icon" id="icon_id" style="font-size: 2.5rem" :style="iconStyleObject" @click="toggle" />
                            <Popover ref="op">
                                <IconViewer class="" @icon-selected="selectIcon($event)"></IconViewer>
                            </Popover>
                        </div>
                    </div>
                </div> -->
                <div class="flex justify-end gap-2">
                    <Button severity="secondary" label="Cancel" icon="pi pi-times" @click="emit('cancel')"></Button>
                    <Button severity="success" label="Save" type="submit" icon="pi pi-check"></Button>
                </div>
            </div>
        </Form>
    </Dialog>
</template>
