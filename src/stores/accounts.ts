import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Account } from '@/types';
import { useAuthStore } from '@/stores/auth';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);
  const isLoading = ref(false);
  const authStore = useAuthStore();

  async function fetchAccounts() {
    isLoading.value = true;
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('name');

      if (error) throw error;
      accounts.value = data;
    } finally {
      isLoading.value = false;
    }
  }

  async function createAccount(
    account: Omit<Account, 'id' | 'created_at' | 'user_id'>
  ) {
    account.user_id = authStore.user.id;
    const { data, error } = await supabase
      .from('accounts')
      .insert(account)
      .select()
      .single();

    if (error) throw error;
    accounts.value.push(data);
    return data;
  }

  async function updateAccount(id: string, updates: Partial<Account>) {
    updates.user_id = authStore.user.id;
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    const index = accounts.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      accounts.value[index] = data;
    }
    return data;
  }

  return {
    accounts,
    isLoading,
    fetchAccounts,
    createAccount,
    updateAccount,
  };
});
