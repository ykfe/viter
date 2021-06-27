import { readFileSync } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';
import _cloneDeep from 'lodash/cloneDeep';
import { writeTmpFile } from '../utils/index';

export interface IRoute {
  component?: string;
  exact?: boolean;
  path?: string;
  routes?: IRoute[];
  wrappers?: string[];
  title?: string;
  [key: string]: any;
}

export default class RoutesService {
  routes: Array<IRoute>;

  dynamicImport: Record<string, any>;

  constructor(props: { routes: Array<IRoute>; dynamicImport: Record<string, any> }) {
    this.routes = props.routes;
    this.dynamicImport = props.dynamicImport;
  }

  resolveRoutes(): { [path: string]: string } {
    const result: { [path: string]: string } = {};

    let componentCursor = 0;
    let wrapperCursor = 0;

    const resolveRoute = (route: IRoute) => {
      if (route.component && !result[route.component]) {
        route.component = resolve(__dirname, route.component);
        result[route.component] = `Component${componentCursor}`;
        componentCursor += 1;
      }
      if (route.wrappers) {
        route.wrappers.forEach((item) => {
          const wrapper = resolve(__dirname, item);
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
      routes.forEach(resolveRoute);
    };

    loopRoutes(this.routes);

    return result;
  }

  dumpRoutes(): { result: string; modulesMap: Array<{ name?: string; path?: string }> } {
    const clonedRoutes = _cloneDeep(this.routes);

    let modules: { [path: string]: string } = {};
    if (!this.dynamicImport) {
      modules = this.resolveRoutes();
    }

    const replaceComponent = (route: IRoute) => {
      if (route.component) {
        route.component = resolve(__dirname, route.component);
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
          const wrapper = resolve(__dirname, item);
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
        route.element = `<Navigate to='${route.redirect}' replace />`;
      }
    };

    function loopRoutes(routes: IRoute[]) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      routes.forEach(loopRoute);
    }
    function loopRoute(route: IRoute) {
      replaceComponent(route);
      replaceWrappers(route);
      replaceRedirect(route);

      if (route.routes) {
        route.children = route.routes;
        delete route.routes;
        loopRoutes(route.children);
      } else {
        // ref: https://stackoverflow.com/questions/49162311/react-difference-between-route-exact-path-and-route-path
        // 没有子路由时赋值 exact
        route.exact = true;
      }
    }

    loopRoutes(clonedRoutes);

    const result = JSON.stringify(clonedRoutes, null, 2)
      .replace(
        /\"element\": (\"(.+?)\")/g,
        (global, m1, m2) => `"element": ${m2.replace(/\^/g, '"')}`
      )
      .replace(
        /\"wrappers\": (\"(.+?)\")/g,
        (global, m1, m2) => `"wrappers": ${m2.replace(/\^/g, '"')}`
      )
      .replace(/\\r\\n/g, '\r\n')
      .replace(/\\n/g, '\r\n');

    let modulesMap: Array<{ name?: string; path?: string }> = [];
    modulesMap = Object.keys(modules).map((modulePath) => ({
      name: modules[modulePath],
      path: modulePath
    }));
    return { result, modulesMap };
  }

  generateRoutesFile(): void {
    const routesTpl = readFileSync(resolve(__dirname, './tplFiles/routes.tpl'), 'utf-8');
    const { result, modulesMap } = this.dumpRoutes();
    writeTmpFile({
      path: resolve(process.cwd(), './src/.viter/routes.tsx'),
      content: Mustache.render(routesTpl, {
        config: result,
        modules: modulesMap,
        dynamic: !!this.dynamicImport,
        loadingComponent: resolve(process.cwd(), './src/', this.dynamicImport?.loading)
      })
    });
  }
}
