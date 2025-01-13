<script setup lang="ts">
import { useTransactionsStore } from '@/stores/transactions';
import { formatCurrency } from '@/utils/formatter';
import { format } from 'date-fns';
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
                            <div class="md:w-40 relative">
                                <!-- <img class="block xl:block mx-auto rounded w-full" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" /> -->
                                <!-- <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag> -->

                                <span class="text-xl font-semibold">{{ format(item.tdate, 'dd/MM/yyyy') }}</span>
                            </div>
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-1">
                                    <div>
                                        <div class="text-lg font-medium">{{ item.description }}</div>
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.categories.name }}</span>
                                    </div>
                                    <div>
                                        <div class="flex items-center gap-2 justify-center py-1">
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.details }}</span>
                                            <!-- <i class="pi pi-star-fill text-yellow-500"></i> -->
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col md:items-end gap-8">
                                    <!-- <Tag :value="formatCurrency(item.amount)" :severity="item.amount > 0 ? 'success' : 'danger'" class="!text-xl font-bold absolute dark:!bg-surface-900"></Tag> -->
                                    <span :class="getAmountColor(item.amount)" class="text-xl font-semibold">{{ formatCurrency(item.amount) }}</span>
                                    <!-- <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <Button icon="pi pi-heart" outlined></Button>
                                        <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap"></Button>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>

        <!-- <DataTable :loading="loading" dataKey="id" :value="transactions" :scrollable="false" scrollHeight="600px" :virtualScrollerOptions="{ itemSize: 46 }" responsive-layout="scroll" stripedRows size="small">
            <Column header="Date" field="tdate" style="width: 15%">
                <template #body="slotProps">
                    <span>{{ format(slotProps.data.tdate, 'dd/MM/yyyy') }}</span>
                </template>
            </Column>
            <Column header="Description" field="description"></Column>
            <Column header="Category" style="width: 15%">
                <template #body="{ data }">
                    <span>{{ data.categories.name }}</span>
                </template>
            </Column>

            <Column field="amount" header="Amount" style="width: 10%">
                <template #body="slotProps">
                    <span :class="getAmountColor(slotProps.data.amount)">{{ formatCurrency(slotProps.data.amount) }}</span>
                </template>
            </Column>
        </DataTable> -->
    </div>
</template>
