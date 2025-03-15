<script setup lang="ts">
import { useTransactionsStore } from '@/stores/transactions';
import { dayMonthString, formatCurrency } from '@/utils/formatter';
import { computed } from 'vue';

const transactionsStore = useTransactionsStore();
const transactions = computed(() => transactionsStore.transactions.slice(Math.max(transactionsStore.transactions.length - 5, 0)).reverse());
const loading = computed(() => transactions.value.length === 0);

const getAmountColor = (amount: number) => {
    if (amount > 0) {
        return 'text-green-500';
    } else {
        return 'text-red-500';
    }
};
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl">Recent Transactions</div>

        <DataView :value="transactions" layout="list">
            <!-- <template #header>
                <div class="flex justify-end">
                    <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                        <template #option="{ option }">
                            <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                        </template>
                    </SelectButton>
                </div>
            </template> -->

            <template #list="slotProps">
                <div class="flex flex-col">
                    <div v-for="(item, index) in slotProps.items" :key="index">
                        <div class="flex flex-col sm:flex-row sm:items-center p-2" :class="{ 'border-t border-surface': index !== 0 }">
                            <div class="flex flex-col items-center mr-4">
                                <div class="flex flex-col">
                                    <span class="text-xl font-semibold">{{ dayMonthString(item.date) }}</span>
                                </div>
                                <div class="flex flex-col rounded-icon !size-16 !text-4xl justify-center items-center">
                                    <!-- <Button :icon="item.categories.icon" rounded aria-label="Category" severity="secondary" class="!size-16 !text-4xl" /> -->
                                    <i :class="item.categories.icon" class=""></i>
                                </div>
                            </div>
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 ml-4 p-2" style="border-left: 2px solid var(--p-surface-100)">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-1">
                                    <div>
                                        <div class="text-lg font-medium">{{ item.description }}</div>
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.categories.name }}</span>
                                    </div>
                                    <div>
                                        <div class="flex items-center gap-2 justify-center py-1">
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.details }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col md:items-end gap-8">
                                    <span :class="getAmountColor(item.amount)" class="!text-2xl font-semibold">{{ formatCurrency(item.amount) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>

        <!-- <Accordion :value="['0']" multiple>
    <AccordionPanel value="0">
        <AccordionHeader> -->
    </div>
</template>
