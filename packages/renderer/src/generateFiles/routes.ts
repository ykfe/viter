import { readFileSync } from 'fs';
import { resolve } from 'path';
import _cloneDeep from 'lodash/cloneDeep';
import { writeTmpFile } from '../utils/index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ArtTemplate = require('art-template');

export interface IRoute {
  component?: string;
  path?: string;
  routes?: IRoute[];
  wrappers?: string[];
  title?: string;
  [key: string]: any;
}

export default class RoutesService {
  routes: Array<IRoute>;

  dynamicImport: Record<string, any>;

  srcPath: string;

  pagesPath: string;

  constructor(props: { routes: Array<IRoute>; dynamicImport: Record<string, any> }) {
    this.routes = props.routes;
    this.dynamicImport = props.dynamicImport;
    this.srcPath = resolve(process.cwd(), './src');
    this.pagesPath = resolve(process.cwd(), './src/pages');
  }

  resolveRoutes(): { [path: string]: string } {
    const result: { [path: string]: string } = {};

    let componentCursor = 0;
    let wrapperCursor = 0;

    const resolveRoute = (route: IRoute) => {
      if (route.component && !result[route.component]) {
        route.component = route.component.startsWith('@/')
          ? route.component
          : resolve(this.pagesPath, route.component);
        result[route.component] = `Component${componentCursor}`;
        componentCursor += 1;
      }
      if (route.wrappers) {
        route.wrappers.map((item) => {
          const wrapper = resolve(this.pagesPath, item);
          if (!result[wrapper]) {
            result[wrapper] = `Wrapper${wrapperCursor}`;
            wrapperCursor += 1;
          }
        });
      }

      if (route.routes) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        loopRoutes(route.routes);
      }
    };
    const loopRoutes = (routes: IRoute[]) => {
      routes.map(resolveRoute);
    };

    loopRoutes(this.routes);

    return result;
  }

  dumpRoutes(): { result: string; modules: { [path: string]: string } } {
    const clonedRoutes = _cloneDeep(this.routes);

    let modules: { [path: string]: string } = {};
    if (!this.dynamicImport) {
      modules = this.resolveRoutes();
    }

    const replaceComponent = (route: IRoute) => {
      if (route.component) {
        route.component = route.component.startsWith('@/')
          ? route.component
          : resolve(this.pagesPath, route.component);
        if (this.dynamicImport) {
          let loading = '';
          if (this.dynamicImport?.loading) {
            loading = `, loading: LoadingComponent`;
          }
          route.component = `dynamic({ loader: () => import('${route.component}')${loading}})`;
        } else {
          route.component = modules[route.component];
        }
      }
      route.element = route.component;
      delete route.component;
    };

    const replaceWrappers = (route: IRoute) => {
      if (route.wrappers) {
        route.wrappers = route.wrappers.map((item) => {
          const wrapper = resolve(this.pagesPath, item);
          if (this.dynamicImport) {
            let loading = '';
            if (this.dynamicImport?.loading) {
              loading = `, loading: LoadingComponent`;
            }
            return `dynamic({ loader: () => import('${wrapper}')${loading}})`;
          }
          return modules[wrapper];
        });
      }
    };

    const replaceRedirect = (route: IRoute) => {
      if (route.redirect) {
        route.element = `Navigate to='${route.redirect}' replace `;
      }
    };

    function loopRoutes(routes: IRoute[]) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      routes.map(loopRoute);
    }
    function loopRoute(route: IRoute) {
      replaceComponent(route);
      replaceWrappers(route);
      replaceRedirect(route);

      if (route.routes) {
        route.children = route.routes;
        delete route.routes;
        loopRoutes(route.children);
      }
    }

    function replacer(key: string, value: any) {
      switch (key) {
        case 'wrappers':
          return `[${value.join(', ')}]`;
        default:
          return value;
      }
    }
    loopRoutes(clonedRoutes);

    const result = JSON.stringify(clonedRoutes, replacer, 2)
      .replace(
        /"element": ("(.+?)")/g,
        (global, m1, m2) => `"element": <${m2.replace(/\^/g, '"')} />`
      )
      .replace(
        /"wrappers": ("(.+?)")/g,
        (global, m1, m2) => `"wrappers": ${m2.replace(/\^/g, '"')}`
      )
      .replace(/\\r\\n/g, '\r\n')
      .replace(/\\n/g, '\r\n');

    return { result, modules };
  }

  generateRoutesFile(): void {
    const routesTpl = readFileSync(resolve(__dirname, './tplFiles/routes.tpl'), 'utf-8');
    const { result, modules } = this.dumpRoutes();

    writeTmpFile({
      path: resolve(process.cwd(), './src/.viter/routes.tsx'),
      content: ArtTemplate.render(routesTpl, {
        config: result,
        modules,
        dynamic: !!this.dynamicImport,
        loadingComponent: this.dynamicImport
          ? resolve(this.pagesPath, this.dynamicImport?.loading)
          : null
      })
    });
  }
}
