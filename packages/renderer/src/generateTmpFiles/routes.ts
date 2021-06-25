import { readFileSync } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';
import { writeTmpFile } from '../utils/index';
import * as React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _uniq from 'lodash/uniq';
const dynamicImport = { loading: '@/loading' };
// const dynamicImport: { loading?: string } | boolean = false;

export interface IRoute {
  component?: string;
  exact?: boolean;
  path?: string;
  routes?: IRoute[];
  wrappers?: string[];
  title?: string;
  [key: string]: any;
}
const config = [
  {
    path: '/',
    component: '/layouts/index',
    routes: [
      { path: '/user', component: './user/login1', title: 'demo1' },
      { path: '/user/login', component: './user/login' },
      { path: '/all', redirect: '/user/login' }
    ]
  }
];
function resolveRoutes() {
  const result: { [path: string]: string } = {};

  let componentCursor = 0;
  let wrapperCursor = 0;
  const resolveRoute = (route: IRoute) => {
    console.log(route.component);
    if (route.component && !result[route.component]) {
      route.component = resolve(__dirname, route.component);
      result[route.component] = `Component${componentCursor}`;
      componentCursor += 1;
    }
    if (route.wrappers) {
      route.wrappers.forEach((item) => {
        let wrapper = resolve(__dirname, item);
        if (!result[wrapper]) {
          result[wrapper] = `Wrapper${wrapperCursor}`;
          wrapperCursor += 1;
        }
      });
    }

    if (route.routes) {
      loopRoutes(route.routes);
    }
  };

  const loopRoutes = (routes: IRoute[]) => {
    routes.forEach(resolveRoute);
  };

  loopRoutes(config);

  return result;
}
function dumpRoutes() {
  const clonedRoutes = _cloneDeep(config);

  let modules: { [path: string]: string } = {};
  if (!dynamicImport) {
    modules = resolveRoutes();
  }

  const replaceComponent = (route: IRoute) => {
    if (route.component) {
      console.log(route.component);
      route.component = resolve(__dirname, route.component);
      if (dynamicImport) {
        let loading = '';
        if (dynamicImport?.loading) {
          loading = `, loading: LoadingComponent`;
        }
        route.component = `dynamic({ loader: () => import('${route.component}')${loading}})`;
      } else {
        route.component = modules[route.component];
      }
    }
  };

  const replaceWrappers = (route: IRoute) => {
    if (route.wrappers) {
      route.wrappers = route.wrappers.map((item) => {
        let wrapper = resolve(__dirname, item);
        if (dynamicImport) {
          let loading = '';
          if (dynamicImport?.loading) {
            loading = `, loading: LoadingComponent`;
          }
          return `dynamic({ loader: () => import('${wrapper}')${loading}})`;
        } else {
          return modules[wrapper];
        }
      });
    }
  };

  function loopRoute(route: IRoute) {
    replaceComponent(route);
    replaceWrappers(route);

    if (route.routes) {
      loopRoutes(route.routes);
    } else {
      // ref: https://stackoverflow.com/questions/49162311/react-difference-between-route-exact-path-and-route-path
      // 没有子路由时赋值 exact
      route.exact = true;
    }
  }

  function loopRoutes(routes: IRoute[]) {
    routes.forEach(loopRoute);
  }

  loopRoutes(clonedRoutes);

  const result = JSON.stringify(clonedRoutes, null, 2)
    .replace(/\"component\": (\"(.+?)\")/g, (global, m1, m2) => {
      return `"element": ${m2.replace(/\^/g, '"')}`;
    })
    .replace(/\"wrappers\": (\"(.+?)\")/g, (global, m1, m2) => {
      return `"wrappers": ${m2.replace(/\^/g, '"')}`;
    })
    .replace(/\\r\\n/g, '\r\n')
    .replace(/\\n/g, '\r\n');

  console.log(modules);
  let modulesMap: Array<{ name?: string; path?: string }> = [];
  modulesMap = Object.keys(modules).map((modulePath) => {
    return {
      name: modules[modulePath],
      path: modulePath
    };
  });
  console.log(modulesMap);
  return { result, modulesMap };
}
export default function generateRoutes(options: {}) {
  const routesTpl = readFileSync(resolve(__dirname, './routes.tpl'), 'utf-8');

  // const content = generateComponentImport(config);
  // console.log(dumpRoutes());
  const { result, modulesMap } = dumpRoutes();

  writeTmpFile({
    path: resolve(__dirname, './routes.tsx'),
    content: Mustache.render(routesTpl, {
      config: result,
      modules: modulesMap,
      dynamic: !!dynamicImport
      // loadingComponent: resolve(process.cwd(), './src/', dynamicImport?.loading)
    })
  });
}
