import { Plugin } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { renderer } from './lib/index';

export interface IRoute {
  component?: string;
  path?: string;
  routes?: IRoute[];
  title?: string;
  redirect?: string;
  [key: string]: any;
}
export interface IDynamicImportConfig {
  loading?: string;
  [key: string]: any;
}
export type IDynamicImport = boolean | IDynamicImportConfig | undefined;

export type Options = {
  // 路由配置
  routes?: Array<IRoute>;
  // 动态路由配置
  dynamicImport?: IDynamicImport;
  // 路由基础路径
  routerBase?: string;
  // 生成入口文件路径
  entryPath?: string;
  // 渲染绑定容器ID
  containerID?: string;
  // 是否自动注入标签
  autoInjectScript?: boolean;
};
export default function useReactRouterConfig(options: Options): Plugin {
  const {
    routes = [],
    dynamicImport,
    entryPath = './.entry/',
    containerID = 'root',
    autoInjectScript = true,
  } = options;
  const autoScriptReg = /<script autoInject="true".*?>.*?<\/script>/gi;
  const autoInject = () => {
    let content = readFileSync(resolve(process.cwd(), './index.html'), 'utf-8');
    if (content.search(autoScriptReg) === -1) {
      content = content.replace(
        '</body>',
        `  <script autoInject="true" type="module" src="${entryPath}/entry.tsx"></script>\n</body>`
      );
    } else {
      content = content.replace(
        autoScriptReg,
        `<script autoInject="true" type="module" src="${entryPath}/entry.tsx"></script>`
      );
    }
    writeFileSync(resolve(process.cwd(), './index.html'), content);
  };
  return {
    name: 'vite-plugin-react-router-config',
    enforce: 'pre',
    config(config, { mode }) {
      if (mode === 'development' && autoInjectScript) {
        // 预构建前修改html
        autoInject();
      }
    },
    buildStart() {
      renderer({ routes, dynamicImport, containerID, entryPath });
    },
    load(id) {
      if (id === resolve(process.cwd(), './index.html')) {
        const content = readFileSync(resolve(process.cwd(), './index.html'), 'utf-8');
        return content.replace(
          '</body>',
          `  <script type="module" src="${entryPath}/entry.tsx"></script>\n</body>`
        );
      }
      return null;
    },
  };
}
