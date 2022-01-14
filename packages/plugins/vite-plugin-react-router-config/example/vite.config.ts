import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import reactRouter from '../dist/index';
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
      autoInjectScript: true,
    }),
  ],
  server: {
    open: '/home',
    port: 6001,
    force: true,
  },
});
