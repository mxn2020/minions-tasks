import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: '/',
    optimizeDeps: {
        include: ['@minions-tasks/sdk'],
    },
    build: {
        commonjsOptions: {
            include: [/tasks/, /node_modules/],
        },
    },
});
