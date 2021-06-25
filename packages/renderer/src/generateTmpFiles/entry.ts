import { readFileSync } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';

export const autoImportsAheadFiles = ['concent.ts'];
export const autoImportFiles = [
  'global.ts',
  'global.tsx',
  'global.css',
  'global.less',
  'global.scss',
  'global.sass'
];
import { writeTmpFile } from '../utils/index';

export default function generateEntry(options: {}) {
  const indexTpl = readFileSync(resolve(__dirname, './entry.tpl'), 'utf-8');
  console.log(__dirname);

  writeTmpFile({
    path: resolve(__dirname, './entry.tsx'),
    content: Mustache.render(indexTpl, {
      imports: `import './global.less'`
    })
  });
}
