<script setup lang="ts">
import TransactionForm from '@/components/transactions/TransactionForm.vue';
import TransactionsChart from '@/components/transactions/TransactionsChart.vue';
import { useAccountsStore } from '@/stores/accounts';
import { useCategoriesStore } from '@/stores/categories';
import { useTransactionsStore } from '@/stores/transactions';
import type { Category, Transaction } from '@/types';
import { formatCurrency } from '@/utils/formatter';
import { FilterMatchMode, FilterOperator, FilterService } from '@primevue/core/api';
import { format } from 'date-fns';
import { DataTableFilterEvent, DataTableFilterMeta } from 'primevue/datatable';
import { computed, onMounted, ref } from 'vue';

const transactionsStore = useTransactionsStore();
const categoriesStore = useCategoriesStore();
const accountsStore = useAccountsStore();

const transactions = computed(() => transactionsStore.transactions);
const categories = computed(() => categoriesStore.categories);
const accounts = computed(() => accountsStore.accounts);
const loading = computed(() => transactionsStore.isLoading); // || categoriesStore.isLoading || accountsStore.isLoading);
const editingTransaction = ref<Transaction | null>(null);
const totale = ref(0);
const viewTransactionDialog = ref(false);

FilterService.register('filterCategories', (value, categories: Category[]) => {
    if (!value) {
        return true;
    }
    return categories.map((c) => c.name).includes(value);
});

const getAmountColor = (amount: number) => {
    if (amount > 0) {
        return 'text-green-500';
    } else {
        return 'text-red-500';
    }
};

const filters = ref({
    tdate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    'categories.name': { value: null, matchMode: 'filterCategories' },
    description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    details: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});

onMounted(async () => {
    try {
        await accountsStore.fetchAccounts();
        await categoriesStore.fetchCategories();
        await transactionsStore.fetchTransactions();
    } finally {
    }
});

const handleRowClick = (transaction: Transaction) => {
    viewTransactionDialog.value = true;
    editingTransaction.value = transaction;
};

const handleSubmit = async (transaction: Transaction) => {
    viewTransactionDialog.value = false;
    editingTransaction.value = null;
    if (!transaction.id) {
        await transactionsStore.createTransaction(transaction);
    } else {
        await transactionsStore.updateTransaction(transaction.id, transaction);
    }
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

const dt = {
    bar: {
        background: '{primary.color}'
    }
};

const filtersChanged = (filters: DataTableFilterEvent) => {
    totale.value = filters.filteredValue.reduce((acc, filter: DataTableFilterMeta) => {
        acc += filter.amount;
        return acc;
    }, 0);
};
</script>

<template>
    <TransactionsChart v-if="0 === 1" :transactions="transactions" />
    <ProgressSpinner v-show="loading" class="overlay" />
    <BlockUI :blocked="loading" :fullScreen="true">
        <div class="card">
            <div class="font-semibold text-xl">Transactions {{ formatCurrency(totale) }}</div>
            <DataTable
                v-model:filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['tdate', 'categories.name', 'description', 'details']"
                dataKey="id"
                :value="transactions"
                :rows="20"
                :rowsPerPageOptions="[5, 10, 20, 50, 100]"
                :scrollable="true"
                scrollHeight="600px"
                :paginator="true"
                removableSort
                responsive-layout="scroll"
                stripedRows
                size="small"
                sortField="date"
                :sortOrder="-1"
                @filter="filtersChanged"
            >
                <Column header="Date" field="tdate" dataType="date" :sortable="true" style="width: 10%">
                    <template #body="slotProps">
                        <span>{{ format(slotProps.data.tdate, 'dd/MM/yyyy') }}</span>
                    </template>
                    <template #filter="{ filterModel }">
                        <DatePicker :manualInput="false" iconDisplay="input" showIcon showButtonBar v-model="filterModel.value" dateFormat="dd/mm/yyyy" fluid></DatePicker>
                    </template>
                </Column>
                <Column header="Description" field="description" :sortable="false" showFilterMenu>
                    <template #body="slotProps">
                        <span :v-tooltip.bottom="slotProps.data.details">{{ slotProps.data.description }}</span>
                    </template>

                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="" />
                    </template>
                </Column>
                <!-- <Column header="Details" field="details" :sortable="false" showFilterMenu style="width: 25%">
                <template #body="slotProps">
                    <span class="one-line-text">{{ slotProps.data.details }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="" />
                </template>
            </Column> -->
                <Column header="Category" filterField="categories.name" :showFilterMatchModes="false" :sortable="true" style="width: 20%">
                    <template #body="{ data }">
                        <div class="flex items-center gap-2">
                            <i :class="data.categories.icon" :style="'color: ' + (data.categories.color.startsWith('#') ? data.categories.color : '#' + data.categories.color) + ';'" style="font-size: 2rem" />
                            <span>{{ data.categories.name }}</span>
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <MultiSelect filter v-model="filterModel.value" @change="filterCallback()" :options="categories" optionLabel="name" placeholder="Any" style="min-width: 14rem" :maxSelectedLabels="1">
                            <template #option="slotProps">
                                <div class="flex items-center gap-2">
                                    <i :class="slotProps.option.icon" style="font-size: 1.5rem" />
                                    <span>{{ slotProps.option.name }}</span>
                                </div>
                            </template>
                        </MultiSelect>
                    </template>
                </Column>

                <Column field="amount" header="Amount" :sortable="false" style="width: 10%">
                    <template #body="slotProps">
                        <span :class="getAmountColor(slotProps.data.amount)">{{ formatCurrency(slotProps.data.amount) }}</span>
                    </template>
                </Column>
                <Column style="width: 5%" header="View">
                    <template #body="slotProps">
                        <Button icon="pi pi-search" type="button" class="p-button-text" @click="handleRowClick(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
            <TransactionForm :initialData="editingTransaction" :transactionDialog="viewTransactionDialog" @cancel="viewTransactionDialog = false" @submit="handleSubmit($event)"></TransactionForm>
        </div>
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
