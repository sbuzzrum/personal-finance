<script setup lang="ts">
import IconPanel from '@/components/IconPanel.vue';
import { IconService } from '@/service/IconService';
import { computed, onMounted, ref } from 'vue';

const ispSelectors = ref<string[]>([]);
//const ispv2Selectors = ref<string[]>([]);
const icoSelectors = ref<string[]>([]);
const icomoonSelectors = ref<string[]>([]);

const emit = defineEmits<{
    iconSelected: [icon: string];
    cancel: [];
}>();

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
    emit('iconSelected', icon);
};
</script>
<template>
    <div class="card">
        <Tabs value="0">
            <TabList>
                <!-- <Tab value="0">Isp icons</Tab>
                <Tab value="1">Ico icons</Tab> -->
                <Tab value="0">Icomoon icons</Tab>
                <!-- <Tab value="3">Ispv2 icons</Tab> -->
            </TabList>
            <TabPanels>
                <!-- <TabPanel value="0">
                    <IconPanel :data="dataIsp" @icon-selected="emitSelection($event)" />
                </TabPanel>
                <TabPanel value="1">
                    <IconPanel :data="dataIco" @icon-selected="emitSelection($event)" />
                </TabPanel> -->
                <TabPanel value="0">
                    <IconPanel :data="dataIcomoon" @icon-selected="emitSelection($event)" />
                </TabPanel>
                <!-- <TabPanel value="3">
                    <IconPanel :data="dataIspv2" />
                </TabPanel> -->
            </TabPanels>
        </Tabs>
    </div>
</template>
