import { readFileSync } from 'fs';
import { resolve } from 'path';
import { writeFile, insertGlobalImports } from '../utils/index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ArtTemplate = require('art-template');

export default function generateEntry(): void {
  const indexTpl = readFileSync(resolve(__dirname, './tplFiles/entry.tpl'), 'utf-8');
  writeFile({
    path: resolve(process.cwd(), './src/.viter/entry.tsx'),
    content: ArtTemplate.render(indexTpl, {
      imports: insertGlobalImports(resolve(process.cwd(), './src'))
    })
  });
}
