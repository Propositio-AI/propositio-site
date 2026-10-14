import path from 'node:path';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
        // @repo/api-client（workspaceパッケージ）とアプリで同じReact / TanStack Queryを共有する
        dedupe: ['react', 'react-dom', '@tanstack/react-query'],
    },
    server: {
        host: true,
        port: 5173,
    },
});
