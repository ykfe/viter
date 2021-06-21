import { resolve, join, dirname, relative } from 'path';
import { existsSync } from 'fs';
function dumpGlobalImports(path: string, files: string[]) {
  return `${getGlobalFiles(path, files)
    .map((file) => `import '../${relative(path, file)}';`)
    .join('\n')}`;
}
function getGlobalFiles(path: string, files: string[]) {
  return files
    .map((file) => join(path || '', file))
    .filter((file) => existsSync(file))
    .slice(0, 1);
}
export default dumpGlobalImports;
