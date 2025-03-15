import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import type { Budget } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAccountsStore = defineStore('budgets', () => {
    const budgets = ref<Budget[]>([]);
    const isLoading = ref(false);
    const authStore = useAuthStore();

    const defaultQuery = '*, categories (id, name, color, icon), totalizers(id, name, description)';

    async function fetchBudgets() {
        isLoading.value = true;
        try {
            const { data, error } = await supabase.from('budgets').select(defaultQuery).order('name');

            if (error) throw error;
            budgets.value = data;
        } finally {
            isLoading.value = false;
        }
    }

    async function createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'user_id'>) {
        budget.user_id = authStore.user.id;
        const { data, error } = await supabase.from('budgets').insert(budget).select(defaultQuery).single();

        if (error) throw error;
        budgets.value.push(data);
        return data;
    }

    async function updateBudget(id: string, updates: Partial<Budget>) {
        updates.user_id = authStore.user.id;
        const { data, error } = await supabase.from('budgets').update(updates).eq('id', id).select(defaultQuery).single();

        if (error) throw error;
        const index = budgets.value.findIndex((a) => a.id === id);
        if (index !== -1) {
            budgets.value[index] = data;
        }
        return data;
    }

    async function deleteBudget(id: string) {
        const { error } = await supabase.from('budgets').delete().eq('id', id);

        if (error) throw error;
        const index = budgets.value.findIndex((a) => a.id === id);
        if (index !== -1) {
            budgets.value.splice(index, 1);
        }
    }

    return {
        budgets,
        isLoading,
        fetchBudgets,
        createBudget,
        updateBudget,
        deleteBudget
    };
});
