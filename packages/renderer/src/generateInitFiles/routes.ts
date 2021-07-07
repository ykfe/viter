import { readFileSync } from 'fs';
import { resolve } from 'path';
import _cloneDeep from 'lodash/cloneDeep';
import { writeFile, generateRandomStr } from '../utils/index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ArtTemplate = require('art-template');

export interface IRoute {
  component?: string;
  path?: string;
  routes?: IRoute[];
  title?: string;
  [key: string]: any;
}

export default class RoutesService {
  routes: Array<IRoute>;

  dynamicImport: Record<string, any>;

  srcPath: string;

  pagesPath: string;

  componentImports: Array<{ path: string; name: string }> = [];

  constructor(props: { routes: Array<IRoute>; dynamicImport: Record<string, any> }) {
    this.routes = props.routes;
    this.dynamicImport = props.dynamicImport;
    this.srcPath = resolve(process.cwd(), './src');
    this.pagesPath = resolve(process.cwd(), './src/pages');
  }

  // 组件路径解析方法
  componentPathResolve(path: string): string {
    if (path.startsWith('@/')) {
      return path;
    }
    return resolve(this.pagesPath, path);
  }

  // 批量解析路由路径
  resolveRoutesPath(routes?: Array<IRoute>): void {
    (routes || this.routes).map((item) => {
      if (item.component) {
        item.component = this.componentPathResolve(item.component);
        if (this.dynamicImport) {
          let loading = '';
          if (this.dynamicImport?.loading) {
            loading = `, loading: <LoadingComponent />`;
          }
          item.component = `dynamic({ loader: () => import('${item.component}')${loading}})`;
        } else {
          const componentName = generateRandomStr(6);
          this.componentImports.push({
            name: `Component_${componentName}`,
            path: item.component
          });
          item.component = `<Component_${componentName} />`;
        }
      }
      if (item.redirect) {
        item.component = `<Navigate to='${item.redirect}' replace />`;
      }
      if (item.routes) {
        this.resolveRoutesPath(item.routes);
        item.children = _cloneDeep(item.routes);
        delete item.routes;
      }
      return item;
    });
  }

  routerConfigToJSON(): string {
    this.resolveRoutesPath();
    const clonedRoutes = this.routes;
    const result = JSON.stringify(clonedRoutes, null, 2)
      .replace(
        /"component": ("(.+?)")/g,
        (global, m1, m2) => `"element": ${m2.replace(/\^/g, '"')}`
      )
      .replace(/\\r\\n/g, '\r\n')
      .replace(/\\n/g, '\r\n');
    return result;
  }

  public generateRoutesFile(): void {
    const routesTpl = readFileSync(resolve(__dirname, './tplFiles/routes.tpl'), 'utf-8');
    const result = this.routerConfigToJSON();

    writeFile({
      path: resolve(process.cwd(), './src/.viter/routes.tsx'),
      content: ArtTemplate.render(routesTpl, {
        config: result,
        modules: this.componentImports,
        dynamic: !!this.dynamicImport,
        loadingComponent: this.dynamicImport
          ? this.componentPathResolve(this.dynamicImport?.loading)
          : null
      })
    });
  }
}
