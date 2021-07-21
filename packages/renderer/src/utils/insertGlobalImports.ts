import { join, relative } from 'path';
import { existsSync } from 'fs';

export const autoImportFiles = [
  'global.ts',
  'global.tsx',
  'global.css',
  'global.less',
  'global.scss',
  'global.sass'
];
function insertGlobalImports(path: string): string {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return `${getGlobalFiles(path, autoImportFiles)
    .map((file) => `import '@/${relative(path, file)}';`)
    .join('\n')}`;
}
function getGlobalFiles(path: string, files: string[]) {
  return files
    .map((file) => join(path || '', file))
    .filter((file) => existsSync(file))
    .slice(0, 1);
}
export default insertGlobalImports;
