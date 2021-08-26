import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cloneDeep } from 'lodash-es';
import { writeFile, generateRandomStr } from '../utils/index';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ArtTemplate = require('art-template');

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

export interface RoutesServiceProps {
  routes: Array<IRoute>;
  dynamicImport?: IDynamicImport & boolean;
  routerBase?: string;
}
export default class RoutesService {
  private routes: Array<IRoute>;

  private dynamicImport: IDynamicImport;

  private pagesPath: string;

  private componentImports: Array<{ path: string; name: string }> = [];

  private routerBase: string | boolean;

  constructor(props: RoutesServiceProps) {
    this.routes = props.routes;
    this.dynamicImport = props.dynamicImport;
    this.pagesPath = resolve(process.cwd(), './src/pages');
    this.routerBase = props.routerBase || false;
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
          loading = `, loading: <LoadingComponent />`;
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
        item.children = cloneDeep(item.routes);
        delete item.routes;
      }
      return item;
    });
  }

  routerConfigToJSON(): string {
    const result = JSON.stringify(this.routes, null, 2)
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
    this.resolveRoutesPath();
    const result = this.routerConfigToJSON();
    const { loading = false } = <IDynamicImportConfig>this?.dynamicImport || {};

    writeFile({
      path: resolve(process.cwd(), './.viter/routes.tsx'),
      content: ArtTemplate.render(routesTpl, {
        config: result,
        modules: this.componentImports,
        dynamic: !!this.dynamicImport,
        loadingComponent: loading ? this.componentPathResolve(loading) : null,
        routerBase: this.routerBase
      })
    });
  }
}
