import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    // server: {
    //     host: '0.0.0.0',
    //     port: 5173,
    //     cors: true,  
    //     hmr: {
    //         host: '192.168.1.19', // IPv4
    //     },
    // },
});
