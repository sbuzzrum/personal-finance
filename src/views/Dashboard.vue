<script setup lang="ts">
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import CategoriesWidget from '@/components/dashboard/CategoriesWidget.vue';
import LastTransactionsWidget from '@/components/dashboard/LastTransactionsWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import TransactionsChartWidget from '@/components/dashboard/TransactionsChartWidget.vue';
import { useAccountsStore } from '@/stores/accounts';
import { useCategoriesStore } from '@/stores/categories';
import { useTransactionsStore } from '@/stores/transactions';
import { formatISO, subMonths } from 'date-fns';
import { computed, onMounted, ref } from 'vue';

const accountsStore = useAccountsStore();
const transactionsStore = useTransactionsStore();
const categoriesStore = useCategoriesStore();
const isLoading = ref(true);

const transactions = computed(() => transactionsStore.transactions);
const categories = computed(() => categoriesStore.categories);

const filter = { from: formatISO(subMonths(new Date(), 1)), to: formatISO(new Date()) };

onMounted(async () => {
    try {
        await Promise.all([accountsStore.fetchAccounts(), transactionsStore.fetchTransactions(), categoriesStore.fetchCategories()]);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8 mb-8">
        <div class="col-span-12 md:col-span-6 xl:col-span-3">
            <StatsWidget :accounts="accountsStore.accounts" :transactions="transactions" />
        </div>
        <div class="col-span-12 md:col-span-6 xl:col-span-3">
            <TransactionsChartWidget :transactions="transactions" />
        </div>
    </div>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <LastTransactionsWidget :categoriesArray="categories" :transactions="transactions" />
            <BestSellingWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <CategoriesWidget :categories="categories" :transactions="transactions" />
        </div>
    </div>
</template>
