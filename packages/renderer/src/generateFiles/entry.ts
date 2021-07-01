import { readFileSync } from 'fs';
import { resolve } from 'path';
import { writeTmpFile, dumpGlobalImports } from '../utils/index';

export const autoImportFiles = [
  'global.ts',
  'global.tsx',
  'global.css',
  'global.less',
  'global.scss',
  'global.sass'
];
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ArtTemplate = require('art-template');

export default function generateEntry(): void {
  const indexTpl = readFileSync(resolve(__dirname, './tplFiles/entry.tpl'), 'utf-8');
  writeTmpFile({
    path: resolve(process.cwd(), './src/.viter/entry.tsx'),
    content: ArtTemplate.render(indexTpl, {
      imports: dumpGlobalImports(resolve(process.cwd(), './src'), autoImportFiles)
    })
  });
}
