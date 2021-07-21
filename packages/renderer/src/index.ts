import { generateEntry, RoutesService, generateRouter } from './generateInitFiles';

export function renderer(config: Record<string, any>): boolean {
  const { routes, dynamicImport } = config;
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
