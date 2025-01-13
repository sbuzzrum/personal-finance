<script setup lang="ts">
import type { Account, Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { computed } from 'vue';

const props = defineProps<{
    accounts: Account[];
    transactions: Transaction[];
}>();

const totalBalance = computed(() => props.accounts.reduce((sum, account) => sum + account.balance, 0));

const lastTransaction = computed(() => props.transactions[0]);
</script>

<template>
    <div class="card mb-0 h-full" v-for="account in accounts" :key="account.id">
        <div class="flex justify-between mb-4">
            <div>
                <span class="block text-muted-color font-medium mb-4">{{ account.name }}</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                    {{ formatCurrency(account.balance) }}
                </div>
            </div>
            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-building-columns text-blue-500 !text-xl" />
            </div>
        </div>
        <span class="text-primary font-medium">Last transaction </span>
        <span v-if="lastTransaction" class="text-muted-color">{{ formatDate(lastTransaction.date) }}</span>
    </div>
</template>
