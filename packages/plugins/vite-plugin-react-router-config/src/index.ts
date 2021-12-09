import { Plugin } from 'vite'
import { renderer } from './lib/index'
import { readFileSync } from 'fs'
import { resolve } from 'path'
// import { writeFile } from './lib/utils'
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
  // 路由配置
  routes?: Array<IRoute>
  // 动态路由配置
  dynamicImport?: IDynamicImport
  // 路由基础路径
  routerBase?: string
  // 生成入口文件路径
  entryPath?: string
  // 渲染绑定容器ID
  containerID?: string
}
export default function useReactRouterConfig(options: Options): Plugin {
  const { routes = [], dynamicImport, entryPath = './.entry/', containerID = 'root' } = options
  let viteMode: string
  return {
    name: 'vite-plugin-react-router-config',
    enforce: 'pre',
    config(config, { mode }) {
      viteMode = mode
    },
    buildStart() {
      renderer({ routes, dynamicImport, containerID, entryPath })
    },
    load(id) {
      if (id === resolve(process.cwd(), './index.html')) {
        const content = readFileSync(resolve(process.cwd(), './index.html'), 'utf-8')
        return content.replace(
          '</body>',
          `  <script type="module" src="${entryPath}/entry.tsx"></script>\n</body>`,
        )
      }
      return null
    },

    transformIndexHtml(html) {
      if (viteMode === 'development') {
        return html.replace(
          '</body>',
          `  <script type="module" src="${entryPath}/entry.tsx"></script>\n</body>`,
        )
      }
    },
  }
}
