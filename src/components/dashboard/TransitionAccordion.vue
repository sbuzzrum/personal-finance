<script setup lang="ts">
import { Transaction } from '@/types/transactions';
import { dayMonthString, formatCurrency } from '@/utils/formatter';
import { $dt } from '@primevue/themes';
import { ref } from 'vue';

const props = defineProps<{
    item: Transaction;
    index: number;
}>();

const getAmountColor = (amount: number) => {
    /*if (amount > 0) {
        return 'text-green-500';
    } else {
        return 'text-red-500';
    }*/
    return $dt('text.color');
    //--p-text-color
};

const active = ref(['0']);
</script>

<template>
    <div class="flex flex-col sm:flex-row sm:items-center p-2" :class="{ 'border-t border-surface': index !== 0 }">
        <div class="flex flex-col items-center mr-4">
            <div class="flex flex-col">
                <span class="text-xl font-semibold">{{ dayMonthString(item.date) }}</span>
            </div>
            <div class="flex flex-col rounded-icon !size-16 !text-4xl justify-center items-center">
                <!-- <Button :icon="item.categories.icon" rounded aria-label="Category" severity="secondary" class="!size-16 !text-4xl" /> -->
                <i :class="item.categories.icon"></i>
            </div>
        </div>
        <Accordion v-model:value="active" multiple class="w-full">
            <AccordionPanel :value="index" class="my-accordion-panel">
                <AccordionHeader>
                    <div class="flex items-center gap-2 w-full">
                        <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 p-2">
                            <div class="flex flex-row md:flex-col justify-between items-start gap-1">
                                <div class="text-lg font-medium">{{ item.description }}</div>
                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.categories.name }}</span>
                            </div>
                            <div class="flex flex-col md:items-end gap-8">
                                <span :class="getAmountColor(item.amount)" class="!text-2xl font-semibold">{{ formatCurrency(item.amount) }}</span>
                            </div>
                        </div>
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 p-2">
                        <div class="flex flex-row md:flex-col justify-between items-start gap-1">
                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm text-pretty">{{ item.details }}</span>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>
<style lang="scss" scoped>
.my-accordion-panel {
    border-left: 2px solid var(--p-surface-100);
    border-bottom: none;
}

@media (max-width: 991px) {
    .my-accordion-panel {
        border-left: none;
        border-bottom: none;
    }
}
</style>
