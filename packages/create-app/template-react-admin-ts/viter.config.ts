import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
const { resolve } = require('path');
console.log(__dirname);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
});
