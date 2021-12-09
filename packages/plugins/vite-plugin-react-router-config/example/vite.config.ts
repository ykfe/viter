import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import reactRouter from '@viterjs/vite-plugin-react-router-config';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    reactRouter({
      routes: [
        { path: '/home', component: './home' },
        { path: '/about', component: './about' },
      ],
      dynamicImport: true,
      entryPath: './temp',
    }),
  ],
  server: {
    open: '/home',
  },
});
