<script setup lang="ts">
import type { Transaction } from '@/types';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { format } from 'date-fns';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps<{
    transactions: Transaction[];
}>();

const chartData = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textColor = documentStyle.getPropertyValue('--primary-color');

    const transactions = props.transactions.slice(Math.max(props.transactions.length - 50, 0));

    return {
        labels: transactions.map((t) => format(t.tdate, 'dd/MM/yy')),
        datasets: [
            {
                label: 'Daily Total',
                data: transactions.map((t) => t.sum),
                //borderColor: 'rgb(59, 130, 246)',
                borderColor: textColor,
                tension: 0.1,
                pointStyle: false
            }
        ]
    };
});

const chartOptions = computed(() => {
    return {
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltips: {
                enabled: false
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
        tooltips: {
            enabled: false
        },
        hover: { mode: null },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        }
    };
});
</script>

<template>
    <div class="card h-full">
        <div class="flex justify-between mb-4">
            <div>
                <span class="block text-muted-color font-medium mb-4">Balance trend</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl"></div>
            </div>
            <div class="flex items-center justify-center">
                <!-- <i class="pi pi-building-columns text-blue-500 !text-xl" /> -->
            </div>
        </div>
        <span class="text-primary font-medium"></span>
        <!-- <span class="text-muted-color"></span> -->
        <div class="w-1/2 h-1/2">
            <Line :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>
