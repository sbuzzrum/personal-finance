<script setup lang="ts">
import TransitionAccordion from '@/components/dashboard/TransitionAccordion.vue';
import { useTransactionsStore } from '@/stores/transactions';
import { computed, ref } from 'vue';

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

const active = ref(['0']);
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
                        <TransitionAccordion :item="item" :index="index" />
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>
