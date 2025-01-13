<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout';
import type { Category, Transaction } from '@/types';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    categories: Category[];
    transactions: Transaction[];
}>();

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const chartData = ref(null);
const chartOptions = ref(null);

const documentStyle = getComputedStyle(document.documentElement);

const getDatasets = () => {
    let categoriesData = props.categories.map((category) => {
        return {
            tot: props.transactions.filter((t) => t.category_id == category.id).reduce((sum, t) => sum + t.amount, 0),
            name: category.name
        };
    });

    let filteredCategoryesData = [];

    for (let i = 0; i < categoriesData.length; i++) {
        let dataset = categoriesData[i];
        if (dataset.tot < 0) {
            filteredCategoryesData.push(Math.abs(dataset.tot));
        }
    }

    return [
        {
            type: 'bar',
            label: 'Categories',
            //backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
            data: filteredCategoryesData,
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'],
            borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
            borderWidth: 1
            //barThickness: 32
        }
    ];
};

const getLabels = () => {
    let categoriesData = props.categories.map((category) => {
        return {
            tot: props.transactions.filter((t) => t.category_id == category.id).reduce((sum, t) => sum + t.amount, 0),
            name: category.name
        };
    });

    let filteredLabels = [];

    for (let i = 0; i < categoriesData.length; i++) {
        let dataset = categoriesData[i];
        if (dataset.tot < 0) {
            filteredLabels.push(dataset.name);
        }
    }

    return filteredLabels;
};

function setChartData() {
    return {
        labels: getLabels(),
        datasets: getDatasets()
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
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
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

watch([getPrimary, getSurface, isDarkTheme, props.transactions], () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

onMounted(() => {
    //datasets.value = getDatasets();
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Revenue Stream</div>
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80" />
    </div>
</template>
