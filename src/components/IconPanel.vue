<script setup lang="ts">
const props = defineProps<{
    data: Record<string, string>[];
}>();

const emit = defineEmits<{
    iconSelected: [icon: string];
    cancel: [];
}>();

const handleClick = (icon: string) => {
    emit('iconSelected', icon);
};

const dt = {
    bar: {
        background: '{primary.color}'
    }
};
</script>
<template>
    <ScrollPanel style="width: 100%; height: 400px" :dt="dt">
        <DataView :value="data" layout="grid" class="p-6">
            <template #grid="slotProps">
                <div class="grid grid-cols-12 gap-4">
                    <div v-for="(item, index) in slotProps.items" :key="index" class="md:col-span-4 lg:col-span-1 p-2">
                        <div class="p-2 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                            <div class="bg-surface-50 flex justify-center rounded p-2">
                                <div class="flex items-center gap-2">
                                    <i :class="item.selector" class="hover:text-primary" style="font-size: 2.5rem" @click="handleClick(item.selector)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
    </ScrollPanel>
</template>
