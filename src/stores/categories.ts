import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import type { Category } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoriesStore = defineStore('categories', () => {
    const categories = ref<Category[]>([]);
    const isLoading = ref(false);
    const authStore = useAuthStore();

    const defaultQuery = '*, transactions(id)';

    async function fetchCategories() {
        isLoading.value = true;
        try {
            const { data, error } = await supabase.from('categories').select(defaultQuery).order('name');

            if (error) throw error;
            categories.value = data;
        } finally {
            isLoading.value = false;
        }
    }

    async function createCategory(category: Omit<Category, 'id' | 'user_id'>) {
        category.user_id = authStore.user.id;
        const response = await supabase.from('categories').insert(category).select(defaultQuery).single();

        if (response.error) throw response.error;
        categories.value.push(response.data);
        return response.data;
    }

    async function seekCategory(name: string) {
        const response = await supabase.from('categories').select('*').eq('name', name).eq('user_id', authStore.user.id);

        if (response.error) throw response.error;
        return response.data;
    }

    async function updateCategory(id: string, category: Partial<Category>) {
        category.user_id = authStore.user.id;
        const { data, error } = await supabase.from('categories').update(category).eq('id', id).select(defaultQuery).single();

        if (error) throw error;
        const index = categories.value.findIndex((c) => c.id === id);
        if (index !== -1) {
            categories.value[index] = data;
        }
        return data;
    }

    async function deleteCategory(id: string) {
        const { error } = await supabase.from('categories').delete().eq('id', id);

        if (error) throw error;
        const index = categories.value.findIndex((c) => c.id === id);
        if (index !== -1) {
            categories.value.splice(index, 1);
        }
    }

    return {
        categories,
        isLoading,
        fetchCategories,
        seekCategory,
        createCategory,
        updateCategory,
        deleteCategory
    };
});
