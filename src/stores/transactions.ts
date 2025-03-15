import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import type { Transaction } from '@/types';
import { parseISO } from 'date-fns';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTransactionsStore = defineStore('transactions', () => {
    const transactions = ref<Transaction[]>([]);
    const recentTransactions = ref<Transaction[]>([]);
    const isLoading = ref(false);
    const authStore = useAuthStore();

    const defaultQuery = `*, amount.sum(), categories (id, name, color, icon), accounts (id, name)`;

    async function fetchTransactions(filters = {}) {
        isLoading.value = true;
        transactions.value = [];
        try {
            const query = supabase.from('transactions').select(defaultQuery).order('date', { ascending: true });

            // Apply filters
            Object.entries(filters).forEach(([key, value]) => {
                if (key !== 'from' && key !== 'to' && value) {
                    query.eq(key, value);
                } else if (key === 'from' && value) {
                    query.gte('date', value);
                } else if (key === 'to' && value) {
                    query.lte('date', value);
                }
            });

            query.is('deleted_at', null);
            //query.not('deleted_at', 'is', null);

            const { data, error } = await query;
            if (error) throw error;

            let tot = 0;
            transactions.value = data.map((transaction) => {
                transaction.sum = tot += transaction.sum;
                transaction.tdate = parseISO(transaction.date);
                return transaction;
            });
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchRecentTransactions() {
        const query = supabase.from('transactions').select(defaultQuery).order('date', { ascending: false }).limit(15);
        query.is('deleted_at', null);

        const { data, error } = await query;

        if (error) throw error;
        recentTransactions.value = data;
    }

    async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) {
        transaction.user_id = authStore.user.id;
        const response = await supabase.from('transactions').insert(transaction).select().single();

        if (response.error) throw response.error;
        else await fetchTransactions();
        return response.data;
    }

    async function updateTransaction(id: string, transaction: Partial<Transaction>) {
        transaction.user_id = authStore.user.id;
        const { data, error } = await supabase.from('transactions').update(transaction).eq('id', id).select(defaultQuery).single();

        if (error) throw error;
        const index = transactions.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            data.tdate = parseISO(data.date);
            transactions.value[index] = data;
        }
        return data;
    }

    async function deleteTransaction(id: string) {
        const { error } = await supabase.from('transactions').delete().eq('id', id);

        if (error) throw error;
        const index = transactions.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            transactions.value.splice(index, 1);
        }
    }

    return {
        transactions,
        recentTransactions,
        isLoading,
        fetchTransactions,
        fetchRecentTransactions,
        createTransaction,
        deleteTransaction,
        updateTransaction
    };
});
