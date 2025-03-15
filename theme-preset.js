import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const customThemePreset = definePreset(Aura, {
    components: {
        progressspinner: {
            colorScheme: {
                light: {
                    root: {
                        'color.1': '{primary.color}',
                        'color.2': '{primary.color}',
                        'color.3': '{primary.color}',
                        'color.4': '{primary.color}'
                    }
                },
                dark: {
                    root: {
                        'color.1': '{primary.color}',
                        'color.2': '{primary.color}',
                        'color.3': '{primary.color}',
                        'color.4': '{primary.color}'
                    }
                }
            }
        }
    }
});

export default {
    preset: customThemePreset,
    options: {
        darkModeSelector: '.app-dark'
        /*cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
        }*/
    }
};
