import { cloneDeep } from 'lodash-es';
import { generateEntry, RoutesService, generateRouter } from './generateInitFiles';

export function renderer(config: Record<string, any>): boolean {
  const { routes, dynamicImport, routerBase } = cloneDeep(config);
  if (!routes || !Array.isArray(routes)) {
    return false;
  }
  try {
    generateEntry();
    generateRouter();
    const routeService = new RoutesService({ routes, dynamicImport, routerBase });
    routeService.generateRoutesFile();
    return true;
  } catch (error) {
    throw new Error(error);
  }
}

export type { IRoute, IDynamicImport } from './generateInitFiles';
