import { generateEntry, generateRoutes, generateRouter } from './generateTmpFiles';
function renderer(config: Record<string, any>) {
  generateEntry(config);
  generateRoutes(config);
  generateRouter(config);
  return true;
}
// export { default as dynamic } from './dynamic';
export default renderer;
