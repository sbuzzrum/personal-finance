import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';
import { useAuthStore } from '@/stores/auth';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const authStore = useAuthStore();

  async function fetchCategories() {
    isLoading.value = true;
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      categories.value = data;
    } finally {
      isLoading.value = false;
    }
  }

  async function createCategory(category: Omit<Category, 'id' | 'user_id'>) {
    category.user_id = authStore.user.id;
    const response = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (response.error) throw response.error;
    categories.value.push(response.data);
    return response.data;
  }

  async function seekCategory(name: string) {
    const response = await supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .eq('user_id', authStore.user.id);

    if (response.error) throw response.error;
    return response.data;
  }

  async function updateCategory(id: string, updates: Partial<Category>) {
    updates.user_id = authStore.user.id;
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    const index = categories.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories.value[index] = data;
    }
    return data;
  }

  return {
    categories,
    isLoading,
    fetchCategories,
    seekCategory,
    createCategory,
    updateCategory,
  };
});
