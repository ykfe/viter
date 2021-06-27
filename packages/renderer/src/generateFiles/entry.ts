import { readFileSync } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';
import { writeTmpFile } from '../utils/index';

export const autoImportsAheadFiles = ['concent.ts'];
export const autoImportFiles = [
  'global.ts',
  'global.tsx',
  'global.css',
  'global.less',
  'global.scss',
  'global.sass'
];

export default function generateEntry(): void {
  const indexTpl = readFileSync(resolve(__dirname, './tplFiles/entry.tpl'), 'utf-8');
  console.log(process.cwd(), 'test');
  writeTmpFile({
    path: resolve(process.cwd(), './src/.viter/entry.tsx'),
    content: Mustache.render(indexTpl, {
      imports: `import './global.less'`
    })
  });
}
