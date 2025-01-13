<script setup lang="ts">
import TransactionForm from '@/components/transactions/TransactionForm.vue';
import TransactionsChart from '@/components/transactions/TransactionsChart.vue';
import { useAccountsStore } from '@/stores/accounts';
import { useCategoriesStore } from '@/stores/categories';
import { useTransactionsStore } from '@/stores/transactions';
import type { Category, Transaction } from '@/types';
import { formatCurrency, monthYearString } from '@/utils/formatter';
import { FilterMatchMode, FilterOperator, FilterService } from '@primevue/core/api';
import { format, formatISO, isWithinInterval, parseISO } from 'date-fns';
import { computed, ref } from 'vue';

const accountsStore = useAccountsStore();
const transactionsStore = useTransactionsStore();
const categoriesStore = useCategoriesStore();

const transactions = computed(() => transactionsStore.transactions);
const categories = computed(() => categoriesStore.categories);
const loading = computed(() => transactions.value.length === 0);
const expandedRowGroups = ref();
const groupRows = ref(false);
const transactionDialog = ref(false);

FilterService.register('filterCategories', (value, categories: Category[]) => {
    if (!value) {
        return true;
    }
    return categories.map((c) => c.name).includes(value);
});

FilterService.register('filterDate', (value: any, filter: Date[]) => {
    if (!value) {
        return true;
    } else if (Array.isArray(filter)) {
        if (filter[0] && filter[1]) {
            return isWithinInterval(parseISO(value), {
                start: filter[0],
                end: filter[1]
            });
        } else if (filter[0]) {
            return value === formatISO(filter[0]);
        }
    } else {
        let pValue = format(parseISO(value), 'dd/MM/yyyy');
        return pValue === filter;
    }
    return false;
});

const getAmountColor = (amount: number) => {
    if (amount > 0) {
        return 'text-green-500';
    } else {
        return 'text-red-500';
    }
};

const calculateDateTotal = (date: string) => {
    let pMontYear = format(parseISO(date), 'MM/yy');
    let total = 0;

    if (transactions) {
        for (let transaction of transactions.value) {
            let montYear = format(parseISO(transaction.date), 'MM/yy');
            if (montYear === pMontYear) {
                total += transaction.amount;
            }
        }
    }

    return total.toFixed(2);
};

const getGroup = (transaction: Transaction) => {
    return format(parseISO(transaction.date), 'MM/yy');
};

const filters = ref({
    //global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    //date: { value: null, matchMode: 'filterDate' },
    tdate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    'categories.name': { value: null, matchMode: 'filterCategories' },
    description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    details: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});

const filtered = (p: any) => {
    console.log(p);
};
</script>

<template>
    <TransactionsChart v-if="0 === 1" :transactions="transactions" />
    <div class="card">
        <div class="font-semibold text-xl">Recent Transactions</div>
        <DataTable
            v-model:filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['tdate', 'categories.name', 'description', 'details']"
            :loading="loading"
            dataKey="id"
            :value="transactions"
            :rows="20"
            :rowsPerPageOptions="[5, 10, 20, 50, 100]"
            :scrollable="false"
            scrollHeight="600px"
            :virtualScrollerOptions="{ itemSize: 46 }"
            :paginator="true"
            removableSort
            responsive-layout="scroll"
            stripedRows
            rowGroupMode="subheader"
            :groupRowsBy="getGroup"
            @filter="filtered"
            size="small"
            sortField="date"
            :sortOrder="-1"
        >
            <template v-if="groupRows" #groupheader="slotProps">
                <span>{{ monthYearString(slotProps.data.date) }}</span>
            </template>
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
                    <span>{{ data.categories.name }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="categories" optionLabel="name" placeholder="Any" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #option="slotProps">
                            <span>{{ slotProps.option.name }}</span>
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
                <template #body>
                    <Button icon="pi pi-search" type="button" class="p-button-text" @click="transactionDialog = true" />
                </template>
            </Column>
        </DataTable>
        <TransactionForm :transactionDialog="transactionDialog" @cancel="transactionDialog = false" @submit="transactionDialog = false"></TransactionForm>
    </div>
</template>
