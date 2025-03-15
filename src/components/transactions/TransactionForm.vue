<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts';
import { useCategoriesStore } from '@/stores/categories';
import type { Transaction } from '@/types';
import { formatISO } from 'date-fns';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
    initialData?: Partial<Transaction>;
    transactionDialog: boolean;
}>();

const emit = defineEmits<{
    submit: [transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id' | 'sum' | 'tdate'>];
    cancel: [];
}>();

const accountsStore = useAccountsStore();
const categoriesStore = useCategoriesStore();

const id = ref(props.initialData?.id ?? '');
const date = ref(props.initialData?.tdate ?? new Date());
const description = ref(props.initialData?.description ?? '');
const amount = ref(props.initialData?.amount?.toString() ?? '0');
const accountId = ref(props.initialData?.account_id ?? '');
const categoryId = ref(props.initialData?.category_id ?? '');
const details = ref(props.initialData?.details ?? '');

const visible = ref(false);

const categories = computed(() => categoriesStore.categories);
const accounts = computed(() => accountsStore.accounts);

onMounted(async () => {
    if (accountsStore.accounts.length === 0) {
        await accountsStore.fetchAccounts();
    }
    if (categoriesStore.categories.length === 0) {
        await categoriesStore.fetchCategories();
    }
});

const onFormSubmit = ({ valid }) => {
    if (valid) {
        let transaction: Omit<Transaction, 'created_at' | 'user_id' | 'sum' | 'tdate'> = {
            id: id.value,
            date: formatISO(date.value),
            description: description.value,
            amount: parseFloat(amount.value),
            account_id: accountId.value,
            category_id: categoryId.value,
            details: details.value || undefined
        };
        emit('submit', transaction);
    }
};

const categoryIcon = computed(() => {
    const category = categories.value.find((c) => c.id === categoryId.value);
    return category?.icon ?? '';
});

watch([props], () => {
    visible.value = props.transactionDialog;

    id.value = props.initialData?.id ?? '';
    date.value = props.initialData?.tdate ?? new Date();
    description.value = props.initialData?.description ?? '';
    amount.value = props.initialData?.amount?.toString() ?? '0';
    accountId.value = props.initialData?.accounts?.id ?? '';
    categoryId.value = props.initialData?.categories?.id ?? '';
    details.value = props.initialData?.details ?? '';

    initialValues.value = {
        date: date.value,
        description: description.value,
        amount: amount.value,
        accountId: accountId.value,
        categoryId: categoryId.value
        // details: details.value
    };
});

const initialValues = ref({
    date: date.value,
    description: description.value,
    amount: amount.value,
    accountId: accountId.value,
    categoryId: categoryId.value
    // details: details.value
});

const resolver = ({ values }) => {
    const errors = { date: [], description: [], amount: [], accountId: [], categoryId: [], details: [] };

    if (!values.date) {
        errors.date.push({ type: 'required', message: 'Date is required.' });
    }

    if (!values.description) {
        errors.description.push({ type: 'required', message: 'Description is required.' });
    }

    if (!values.amount || values.amount === 0) {
        errors.amount.push({ type: 'required', message: 'Amount is required.' });
    }

    if (!values.accountId) {
        errors.accountId.push({ type: 'required', message: 'Account is required.' });
    }

    if (!values.categoryId) {
        errors.categoryId.push({ type: 'required', message: 'Category is required.' });
    }

    /*if (!values.details) {
        errors.details.push({ type: 'required', message: 'Details is required.' });
    }*/

    return {
        errors
    };
};
</script>

<template>
    <Dialog v-model:visible="visible" :style="{ width: '450px' }" header="Transaction details" :modal="true">
        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="space-y-4">
            <div class="card flex flex-col gap-4 w-full py-2">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <FloatLabel variant="on" class="w-full md:w-full">
                            <Select id="account_id" name="account" v-model="accountId" optionValue="id" :options="accounts" optionLabel="name" placeholder="Select One" class="w-full"></Select>
                            <label for="account_id">Account</label>
                        </FloatLabel>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <FloatLabel variant="on" class="w-full md:w-full">
                            <DatePicker id="date_id" name="date" :manualInput="false" iconDisplay="input" showIcon showButtonBar v-model="date" dateFormat="dd/mm/yy" fluid></DatePicker>
                            <label for="date_id">Date</label>
                        </FloatLabel>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <InputGroup>
                            <FloatLabel variant="on">
                                <InputText id="amount_id" name="amount" v-model="amount" type="number" step="0.01" placeholder="" class="text-right !w-6/12" />
                                <label for="amount_id">Amount</label>
                            </FloatLabel>
                            <InputGroupAddon>€</InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <FloatLabel variant="on" class="w-full">
                            <InputText id="description_id" name="description" class="w-full" v-model="description" type="text" />
                            <label for="description_id">Description</label>
                        </FloatLabel>
                        <!-- <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">{{ $form.description.error.message }}</Message> -->
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <InputGroup>
                            <FloatLabel variant="on" class="w-full md:w-full">
                                <Select filter id="category_id" name="category" v-model="categoryId" :options="categories" optionValue="id" optionLabel="name" placeholder="Select One" class="w-full"></Select>
                                <label for="category_id">Category</label>
                            </FloatLabel>
                            <InputGroupAddon>
                                <i :class="categoryIcon" :style="'color: ' + (categoryIcon.startsWith('#') ? categoryIcon : '#' + categoryIcon) + ';'" style="font-size: 1.5rem" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <FloatLabel variant="on" class="w-full">
                            <Textarea id="details_id" name="details" class="w-full" v-model="details" rows="5"></Textarea>
                            <label for="details_id">Additional details</label>
                        </FloatLabel>
                        <!-- <Message v-if="$form.details?.invalid" severity="error" size="small" variant="simple">{{ $form.details.error.message }}</Message> -->
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <Button severity="secondary" label="Cancel" icon="pi pi-times" @click="emit('cancel')"></Button>
                <Button severity="success" label="Save" type="submit" icon="pi pi-check"></Button>
            </div>
        </Form>
    </Dialog>
</template>
