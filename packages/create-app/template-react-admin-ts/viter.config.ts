import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
const { resolve } = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
});
