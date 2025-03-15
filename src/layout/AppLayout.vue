<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/auth';
import { computed, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';

const authStore = useAuthStore();
const router = useRouter();

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref<EventListenerOrEventListenerObject | null>(null);

watchEffect(() => {
    if (!authStore.user) {
        router.push('/auth/login');
    }
});

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event: Event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event: Event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return event.target !== null && !(sidebarEl?.isSameNode(event.target as Element) || sidebarEl?.contains(event.target as Element) || topbarEl?.isSameNode(event.target as Element) || topbarEl?.contains(event.target as Element));
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <AppTopbar />
        <AppSidebar />
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>
            <!-- <AppFooter /> -->
        </div>
        <div class="layout-mask animate-fadein" />
    </div>
    <Toast />
</template>
