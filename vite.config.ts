import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    /*optimizeDeps: {
        noDiscovery: true
    },*/
    server: {
        host: '0.0.0.0'
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
        //vueDevTools()
    ],
    resolve: {
        alias: {
            //'@': fileURLToPath(new URL('./src', import.meta.url)),
            '@': path.resolve(__dirname, './src')
        }
    }
});
