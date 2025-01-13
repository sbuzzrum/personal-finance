<script setup lang="ts">
//import { useLayout } from '@/layout/composables/layout';
import type { Transaction } from '@/types';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { format, parseISO, startOfDay } from 'date-fns';
import { computed, onMounted, ref } from 'vue';
import { Line } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps<{
    transactions: Transaction[];
}>();

const calendarValue = ref();

//const { getPrimary, getSurface, isDarkTheme } = useLayout();

const chartOptions = ref(null);

const _chartData = computed(() => {
    const transactions = props.transactions;

    return {
        labels: transactions.map((t) => format(parseISO(t.date), 'dd/MM/yy')),
        datasets: [
            {
                label: 'Daily Total',
                data: transactions.map((t) => t.sum),
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1,
                pointStyle: false
            }
        ]
    };
});

const chartData = computed(() => {
    const transactions = props.transactions;

    const dailyTotals = transactions.reduce(
        (acc, transaction) => {
            const date = format(startOfDay(transaction.tdate), 'dd/MM/yyyy');
            acc[date] = (acc[date] || 0) + transaction.amount;
            return acc;
        },
        {} as Record<string, number>
    );

    const sortedDates = Object.keys(dailyTotals).sort();

    return {
        labels: sortedDates,
        datasets: [
            {
                label: 'Daily Total',
                data: sortedDates.map((date) => dailyTotals[date]),
                //borderColor: 'rgb(59, 130, 246)',
                tension: 0.1,
                pointStyle: false
            }
        ]
    };
});

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: true,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                stacked: false,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                stacked: false,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    //color: borderColor,
                    color: 'transparent',
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

/*watch([getPrimary, getSurface, isDarkTheme, props], () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});*/

onMounted(() => {
    //chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Revenue Stream</div>
        <FloatLabel>
            <DatePicker :showIcon="true" inputId="over_label" :showButtonBar="true" v-model="calendarValue" dateFormat="dd/mm/yy" fluid :showOnFocus="false"></DatePicker>
            <label for="over_label">Over Label</label>
        </FloatLabel>

        <Line :data="chartData" :options="chartOptions" class="max-h-80 h-80" />
    </div>
</template>
