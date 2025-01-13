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

    async function fetchTransactions(filters = {}) {
        isLoading.value = true;
        try {
            const query = supabase.from('transactions').select(`*, amount.sum(), categories (id, name, color), accounts (id, name)`).order('date', { ascending: true });

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
        const { data, error } = await supabase
            .from('transactions')
            .select(
                `
        *,
        categories (id, name, color),
        accounts (id, name)
      `
            )
            .order('date', { ascending: false })
            .limit(15);

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

    return {
        transactions,
        recentTransactions,
        isLoading,
        fetchTransactions,
        fetchRecentTransactions,
        createTransaction
    };
});
