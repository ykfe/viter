<p align="center">
  <a href="https://viterjs.github.io/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://img.alicdn.com/imgextra/i4/O1CN01Y566rd1lxNVUjXnfJ_!!6000000004885-0-tps-754-600.jpg" alt="Viter logo">
  </a>
</p>
<p align="center">小而美的 Vite 中后台开发框架</p>
<p align="center">
  <a href="https://npmjs.com/package/viter"><img src="https://img.shields.io/npm/v/viter.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
  
</p>
<br/>

## 特性

- 😀 **开箱即用**：提供开箱即用的工程配置以及标准模板
- 😊 **路由**：基于新一代 React Router V6，采用完全配置式路由
- 🤣 **代码分割** 支持基于路由的代码分割
- 😅 **TypeScript**：默认使用 TypeScript
- 😉 **插件**：完全基于 Vite 插件体系，无生态壁垒

## 快速上手

### 环境准备

首先得有 [node](https://nodejs.org/en/)，并确保 node 版本是 12 或以上。（mac 下推荐使用 [nvm](https://github.com/creationix/nvm) 来管理 node 版本）

```bash
$ node -v
v12.18.3
```

### 搭建第一个 Viter 项目

使用 NPM:

```bash
$ npm init @viterjs/app

npx: 5 安装成功，用时 4.312 秒
✔ Project name: · viter-project
✔ Select a framework: · react-admin-ts
react-admin-ts

Scaffolding project in /Users/jerry/work-project/viter-project...

Done. Now run:

  cd viter-project
  npm install
  npm run dev

```

### 启动项目

```bash
$ npm run dev

> viter-project@0.0.1 dev /Users/xxx/github-project/xxx
> viter


  vite v2.5.1 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose

```

在浏览器里打开 [http://localhost:3000/](http://localhost:3000/)，能看到以下界面，

![](https://img.alicdn.com/imgextra/i3/O1CN014yo0KO1WG7rjR5gMJ_!!6000000002760-0-tps-1444-982.jpg)

### 修改配置

通过修改项目中的 `viter.config.ts` 文件，配置项目。模板中的配置如下：

```ts
import { defineConfig } from 'viter';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  // 插件配置
  plugins: [reactRefresh()],
  // 配置路由
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
  // 开启动态加载
  dynamicImport: {
    loading: '@/loading',
  },
});
```

更多配置，请前往 [Viter 文档](https://viterjs.github.io/) 查看。

### 部署发布

#### 构建

```bash
$ npm run build

> viter-project@0.0.0 build /Users/jerry/github-project/viter-project
> viter build

vite v2.5.6 building for production...
✓ 44 modules transformed.
dist/index.html                  0.45 KiB
dist/assets/index.cb6faa6d.js    0.18 KiB / brotli: 0.12 KiB
dist/assets/index.0662466a.js    0.77 KiB / brotli: 0.33 KiB
dist/assets/index.d5836ef7.js    0.12 KiB / brotli: 0.09 KiB
dist/assets/index.0c87e543.js    0.12 KiB / brotli: 0.09 KiB
dist/assets/index.a851cde7.js    2.38 KiB / brotli: 0.84 KiB
dist/assets/index.588c1ae3.css   0.53 KiB / brotli: 0.25 KiB
dist/assets/vendor.eb369f9e.js   143.59 KiB / brotli: 40.60 KiB

  finished in 3202ms.
```

构建产物默认生成到 `./dist` 下。

#### 本地验证

发布之前，可以通过 `serve` 做本地验证，

```bash
$ npm run serve

> viter-project@0.0.0 serve /Users/xxx/github-project/viter-project
> viter preview


  vite v2.5.6 build preview server running at:

  > Local: http://localhost:5000/
  > Network: use `--host` to expose

```

访问 [http://localhost:5000](http://localhost:5000)，正常情况下应该是和执行 `npm run dev` 时是一致的。

#### 部署

本地验证完，就可以部署了。你需要把 `dist` 目录部署到服务器上。

### Packages

| Package                                                | Version                                                                                                                     |
| ------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| [viter](packages/viter)                                | ![viter version](https://img.shields.io/npm/v/viter.svg?label=%20)                                                          |
| [@viterjs/render](packages/renderer)                   | ![plugin-vue version](https://img.shields.io/npm/v/@viterjs/renderer.svg?label=%20)                                         |
| [@viterjs/runtime](packages/runtime)                   | ![runtime version](https://img.shields.io/npm/v/@viterjs/runtime.svg?label=%20)                                             |
| [@viterjs/eslint-config](packages/eslint-config-viter) | ![@viterjs/eslint-config version](https://img.shields.io/npm/v/@viterjs/eslint-config.svg?label=%20)                        |
| [@viterjs/create-app](packages/create-app)             | [![create-vite version](https://img.shields.io/npm/v/@viterjs/create-app.svg?label=%20)](packages/create-vite/CHANGELOG.md) |

### License

[MIT](https://github.com/ykfe/viter/blob/main/LICENSE)
