<script setup lang="ts">
import type { Category, Transaction } from '@/types';
import { formatCurrency, formatDateDDMMYYYY, monthYearString } from '@/utils/formatter';
import { FilterMatchMode, FilterService } from '@primevue/core/api';
import { format, parseISO } from 'date-fns';
import { computed, ref } from 'vue';

FilterService.register('filterCategories', (value, categories: Category[]) => {
    if (!value) {
        return true;
    }
    return categories.map((c) => c.name).includes(value);
});

const props = defineProps<{
    transactions: Transaction[];
    categoriesArray: Category[];
}>();

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

    if (props.transactions) {
        for (let transaction of props.transactions) {
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

const expandedRowGroups = ref();
const groupRows = ref(false);
const loading = computed(() => props.transactions.length === 0);

const filters = ref({
    //global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.EQUALS },
    'categories.name': { value: null, matchMode: 'filterCategories' },
    description: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
});

const filtered = (p: any) => {
    console.log(p);
};
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Recent Transactions</div>
        <DataTable
            v-model:filters="filters"
            filterDisplay="row"
            :globalFilterFields="['date', 'categories.name', 'description']"
            :loading="loading"
            dataKey="id"
            :value="transactions"
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            :scrollable="false"
            scrollHeight="400px"
            :virtualScrollerOptions="{ itemSize: 46 }"
            :paginator="true"
            removableSort
            responsive-layout="scroll"
            stripedRows
            rowGroupMode="subheader"
            :groupRowsBy="getGroup"
            @filter="filtered"
        >
            <template v-if="groupRows" #groupheader="slotProps">
                <!-- <div class="flex items-center gap-2"> -->
                <span>{{ monthYearString(slotProps.data.date) }}</span>
                <!-- </div> -->
            </template>
            <Column header="Date" field="date" :sortable="true" :showFilterMenu="false" style="width: 15%">
                <template #body="slotProps">
                    <span>{{ formatDateDDMMYYYY(slotProps.data.date) }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search" />
                </template>
            </Column>
            <Column header="Description" field="description" :sortable="false" :showFilterMenu="false">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by description" />
                </template>
            </Column>
            <Column header="Category" filterField="categories.name" :showFilterMenu="false" :sortable="false" style="width: 35%">
                <template #body="{ data }">
                    <span>{{ data.categories.name }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="categoriesArray" optionLabel="name" placeholder="Any" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #option="slotProps">
                            <span>{{ slotProps.option.name }}</span>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column field="amount" header="Amount" :sortable="false" style="width: 20%">
                <template #body="slotProps">
                    <span :class="getAmountColor(slotProps.data.amount)">{{ formatCurrency(slotProps.data.amount) }}</span>
                </template>
            </Column>
            <!-- <Column style="width: 15%" header="View">
                <template #body>
                    <Button icon="pi pi-search" type="button" class="p-button-text" />
                </template>
            </Column> -->
            <template v-if="groupRows" #groupfooter="slotProps">
                <div class="flex justify-end font-bold w-full">Total: {{ calculateDateTotal(slotProps.data.date) }}</div>
            </template>
        </DataTable>
    </div>
</template>
