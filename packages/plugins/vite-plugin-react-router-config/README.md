# vite-plugin-react-router-config

> 用于实现完全配置式的编写路由，自动生成路由相关文件

## 用法

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import reactRouter from '@viterjs/vite-plugin-react-router-config'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactRouter({
      routes: [
        { path: '/home', component: './home' },
        { path: '/about', component: './about' },
      ], // 路由配置
      dynamicImport: true, // 动态加载路由
      entryPath: './temp', // 入口文件生成路径
    }),
  ],
  server: {
    open: '/home',
  },
})
```

## 详细插件配置

### path

- Type: `string`

配置路由路径，与 react-router@6 的 path 要求一致

### component

- Type: `string`

配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 `src/pages` 目录开始找起。

如果指向 `src` 目录的文件，可以自行配置 alias，也可以用 `../`。比如 `component: '../layouts/index'`。

### routes

配置子路由，通常在需要为多个路径增加 layout 组件时使用。

比如：

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRouter from '@viterjs/vite-plugin-react-router-config'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactRouter({
      routes: [
        { path: '/home', component: './home' },
        {
          path: '/',
          component: '@/layouts',
          routes: [
            { path: '/form', component: './form' },
            { path: '/table', component: './table' },
          ],
        },
      ],
    }),
  ],
})
```

然后在 `src/layout/index` 中通过 `<Outlet>` 渲染子路由，

```jsx
import { Outlet } from 'react-router-dom'
export default (props) => {
  return (
    <div style={{ padding: 20 }}>
      <Outlet />
    </div>
  )
}
```

这样，访问 `/form` 和 `/table` 就会带上 `src/layouts/index` 这个 layout 组件。

### redirect

- Type: `string`

配置路由跳转。

比如：

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRouter from '@viterjs/vite-plugin-react-router-config'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactRouter({
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: './home' },
      ],
    }),
  ],
})
```

访问 `/` 会跳转到 `/home`，并由 `src/pages/home` 文件进行渲染。

### dynamicImport

- Type: `{ loading: string } | boolean`

配置路由按需加载。路由按需加载功能默认是关闭的，你需要在使用之前先通过配置开启，配置中包含 loading 选项，用于配置加载状态时展示的组件地址，如果不配置或配置为`true`会展示默认加载组件。

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRouter from '@viterjs/vite-plugin-react-router-config'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactRouter({
      dynamicImport: { loading: './Loading' },
    }),
  ],
})
```

## 页面跳转

由于本框架路由模块基于 react-router@6 ，路由的基础跳转用法与 react-router@6 保持一致。实例如下：

```js
import { useNavigate } from 'react-router-dom'

// FC 组件
function xxx() {
  const navigate = useNavigate()
  // 跳转 home
  navigate('/home')
  // 后退
  navigate(-1)
}
```

## 选项

```ts
export interface IRoute {
  component?: string
  path?: string
  routes?: IRoute[]
  title?: string
  redirect?: string
  [key: string]: any
}
export interface IDynamicImportConfig {
  loading?: string
  [key: string]: any
}
export type IDynamicImport = boolean | IDynamicImportConfig | undefined

export type Options = {
  routes?: Array<IRoute>
  dynamicImport?: IDynamicImport & boolean
  routerBase?: string
  entryPath?: string
  containerID?: string
}
```
