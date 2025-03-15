import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import type { Totalizer } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTotalizersStore = defineStore('totalizers', () => {
    const totalizers = ref<Totalizer[]>([]);
    const isLoading = ref(false);
    const authStore = useAuthStore();

    async function fetchTotalizers() {
        isLoading.value = true;
        try {
            const { data, error } = await supabase.from('totalizers').select('*').order('name');

            if (error) throw error;
            totalizers.value = data;
        } finally {
            isLoading.value = false;
        }
    }

    async function createTotalizer(totalizer: Omit<Totalizer, 'id' | 'created_at' | 'user_id'>) {
        totalizer.user_id = authStore.user.id;
        const { data, error } = await supabase.from('totalizers').insert(totalizer).select().single();

        if (error) throw error;
        totalizers.value.push(data);
        return data;
    }

    async function updateTotalizer(id: string, updates: Partial<Totalizer>) {
        updates.user_id = authStore.user.id;
        const { data, error } = await supabase.from('totalizers').update(updates).eq('id', id).select().single();

        if (error) throw error;
        const index = totalizers.value.findIndex((a) => a.id === id);
        if (index !== -1) {
            totalizers.value[index] = data;
        }
        return data;
    }

    async function deleteTotalizer(id: string) {
        const { error } = await supabase.from('totalizers').delete().eq('id', id);

        if (error) throw error;
        const index = totalizers.value.findIndex((a) => a.id === id);
        if (index !== -1) {
            totalizers.value.splice(index, 1);
        }
    }

    return {
        totalizers,
        isLoading,
        fetchTotalizers,
        createTotalizer,
        updateTotalizer,
        deleteTotalizer
    };
});
