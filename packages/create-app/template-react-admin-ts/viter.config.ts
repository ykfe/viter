import { defineConfig } from 'viter';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  routes: [
    {
      path: '/',
      component: '@/layout',
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: './Home' },
        { path: '/about', component: './About' },
        { path: '/404', component: './NotFind' },
        { path: '/*', redirect: '/404' },
      ],
    },
  ],
  dynamicImport: {
    loading: '@/loading',
  },
});
