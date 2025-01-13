import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                }
            ]
        },
        {
            path: '/auth/login',
            component: AppLayout,
            children: [
                {
                    path: '/auth/login',
                    name: 'login',
                    component: () => import('@/views/pages/auth/Login.vue')
                }
            ]
        },
        {
            path: '/transactions',
            component: AppLayout,
            children: [
                {
                    path: '/transactions',
                    name: 'transactions',
                    component: () => import('@/views/pages/Transactions.vue')
                }
            ]
        }
    ]
});

export default router;
