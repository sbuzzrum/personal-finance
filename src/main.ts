import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';

import { createPinia } from 'pinia';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import { createApp } from 'vue';
import customThemePreset from '../theme-preset.js';
import App from './App.vue';
import router from './router';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    /*theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }*/
    theme: customThemePreset
});
app.use(ToastService);
app.use(ConfirmationService);

app.directive('tooltip', Tooltip);
app.mount('#app');
