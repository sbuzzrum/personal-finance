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
        },
        {
            path: '/categories',
            component: AppLayout,
            children: [
                {
                    path: '/categories',
                    name: 'categories',
                    component: () => import('@/views/pages/Categories.vue')
                }
            ]
        },
        {
            path: '/icons',
            component: AppLayout,
            children: [
                {
                    path: '/icons',
                    name: 'icons',
                    component: () => import('@/views/pages/IconSorter.vue')
                }
            ]
        },
        {
            path: '/totalizers',
            component: AppLayout,
            children: [
                {
                    path: '/totalizers',
                    name: 'totalizers',
                    component: () => import('@/views/pages/Totalizers.vue')
                }
            ]
        }
        // {
        //     path: '/budgets',
        //     component: AppLayout,
        //     children: [
        //         {
        //             path: '/budgets',
        //             name: 'budgets',
        //             component: () => import('@/views/pages/Budgets.vue')
        //         }
        //     ]
        // }
    ]
});

export default router;
