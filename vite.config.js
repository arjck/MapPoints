import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        
    ],
    // server: {
    //     host: '172.20.10.3', // replace with your local IP
    //     port: 5173,
    //     strictPort: true,
    //     // origin: '172.20.10.3'
    // },
});
