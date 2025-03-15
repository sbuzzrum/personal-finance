<script setup lang="ts">
import IconSorterPanel from '@/components/IconSorterPanel.vue';
import { IconService } from '@/service/IconService';
import { IconToRemoveService } from '@/service/IconToRemoveService';
import { computed, onMounted, ref, watch } from 'vue';

const ispSelectors = ref<string[]>([]);
//const ispv2Selectors = ref<string[]>([]);
const icoSelectors = ref<string[]>([]);
const icomoonSelectors = ref<string[]>([]);
const iconsToRemove = ref<string[]>([]);

const emit = defineEmits<{
    iconSelected: [icon: string];
    cancel: [];
}>();

const selectedIcons = ref('');
const remainIcons = ref('');

onMounted(() => {
    IconService.getIspSelectors().then((data) => {
        ispSelectors.value = data;
    });
    // IconService.getIspv2Selectors().then((data) => {
    //     ispv2Selectors.value = data;
    // });
    IconService.getIcoSelectors().then((data) => {
        icoSelectors.value = data;
    });
    IconService.getIcomoonSelectors().then((data) => {
        icomoonSelectors.value = data;
    });

    IconToRemoveService.getIcomoonSelectors().then((data) => {
        iconsToRemove.value = data;
        selectedIcons.value = data.map((entry) => "'" + entry + "'").join(',\n');
    });
});

watch([iconsToRemove], () => {
    iconsToRemove.value.forEach((entry) => {
        icomoonSelectors.value = filterIcons(icomoonSelectors.value, entry);
    });
});

const dataIsp = computed(() => {
    return ispSelectors.value
        .filter((s) => s.startsWith('isp-'))
        .map((selector) => {
            return {
                selector: selector
            };
        });
});

const dataIco = computed(() => {
    return icoSelectors.value
        .filter((s) => s.startsWith('ico-'))
        .map((selector) => {
            return {
                selector: selector
            };
        });
});

const dataIcomoon = computed(() => {
    return icomoonSelectors.value
        .filter((s) => s.startsWith('icomoon-'))
        .map((selector) => {
            return {
                selector: selector
            };
        });
});

// const dataIspv2 = computed(() => {
//     return ispv2Selectors.value
//         .filter((s) => s.startsWith('ispv2-'))
//         .map((selector) => {
//             return {
//                 selector: selector
//             };
//         });
// });

const emitSelection = (icon: string) => {
    selectedIcons.value.length > 0 ? (selectedIcons.value += `,\n \'${icon}\'`) : (selectedIcons.value = "'" + icon + "'");
    if (icon.startsWith('isp-')) {
        ispSelectors.value = filterIcons(ispSelectors.value, icon);
        //ispSelectors.value = ispSelectors.value.filter((s) => s !== icon);
    } else if (icon.startsWith('ico-')) {
        icoSelectors.value = filterIcons(icoSelectors.value, icon);
        //icoSelectors.value = icoSelectors.value.filter((s) => s !== icon);
    } else if (icon.startsWith('icomoon-')) {
        icomoonSelectors.value = filterIcons(icomoonSelectors.value, icon);
        //icomoonSelectors.value = icomoonSelectors.value.filter((s) => s !== icon);
    } else if (icon.startsWith('ispv2-')) {
        //filterIcons(ispv2Selectors.value, icon);
        //ispv2Selectors.value = ispv2Selectors.value.filter((s) => s !== icon);
    }
};

const filterIcons = (data: any[], query: string) => {
    return data.filter((item) => item !== query);
};

const generateRemaingIcons = () => {
    remainIcons.value = 'ISP icons';
    remainIcons.value += '\n' + ispSelectors.value.map((entry) => "'" + entry + "'").join(',\n');
    remainIcons.value += '\nIco icons';
    remainIcons.value += '\n' + icoSelectors.value.map((entry) => "'" + entry + "'").join(',\n');
    remainIcons.value += '\nIcomoon icons';
    remainIcons.value += '\n' + icomoonSelectors.value.map((entry) => "'" + entry + "'").join(',\n');
};
</script>
<template>
    <div class="grid grid-cols-12 gap-8 mb-8">
        <div class="col-span-8 h-full">
            <div class="card">
                <Tabs value="0">
                    <TabList>
                        <Tab value="0">Isp icons</Tab>
                        <Tab value="1">Ico icons</Tab>
                        <Tab value="2">Icomoon icons</Tab>
                        <!-- <Tab value="3">Ispv2 icons</Tab> -->
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <IconSorterPanel :data="dataIsp" @icon-selected="emitSelection($event)" />
                        </TabPanel>
                        <TabPanel value="1">
                            <IconSorterPanel :data="dataIco" @icon-selected="emitSelection($event)" />
                        </TabPanel>
                        <TabPanel value="2">
                            <IconSorterPanel :data="dataIcomoon" @icon-selected="emitSelection($event)" />
                        </TabPanel>
                        <!-- <TabPanel value="3">
                    <IconSorterPanel :data="dataIspv2" />
                </TabPanel> -->
                    </TabPanels>
                </Tabs>
            </div>
        </div>
        <div class="col-span-4 h-full">
            <div class="card">
                <div class="flex flex-col gap-6 mt-2">
                    <div class="flex items-center gap-2 justify-center">
                        <Textarea v-model="selectedIcons" rows="10" class="w-full h-full" />
                        <Button label="Clear" icon="pi pi-" severity="secondary" @click="selectedIcons = ''" />
                    </div>
                    <div class="flex items-center gap-2 justify-center">
                        <Textarea v-model="remainIcons" rows="10" class="w-full h-full" />
                        <Button label="Generate" severity="secondary" @click="generateRemaingIcons()" />
                        <Button label="Clear" severity="secondary" @click="remainIcons = ''" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
