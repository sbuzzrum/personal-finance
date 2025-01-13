<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
    await authStore.initialize();
    if (!authStore.user) {
        router.push('/auth/login');
    }
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
