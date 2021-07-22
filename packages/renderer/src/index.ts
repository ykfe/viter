import { generateEntry, RoutesService, generateRouter } from './generateInitFiles';
import { cloneDeep } from 'lodash-es';

export function renderer(config: Record<string, any>): boolean {
  const { routes, dynamicImport } = cloneDeep(config);
  if (!routes || !Array.isArray(routes)) {
    return false;
  }
  try {
    generateEntry();
    generateRouter();
    const routeService = new RoutesService({ routes, dynamicImport });
    routeService.generateRoutesFile();
    return true;
  } catch (error) {
    throw new Error(error);
  }
}
export type { IRoute, IDynamicImport } from './generateInitFiles';
