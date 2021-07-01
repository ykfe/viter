import { readFileSync } from 'fs';
import { resolve } from 'path';
import { writeFile } from '../utils/index';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ArtTemplate = require('art-template');

export default function generateRouter(): void {
  const routerTpl = readFileSync(resolve(__dirname, './tplFiles/router.tpl'), 'utf-8');

  writeFile({
    path: resolve(process.cwd(), './src/.viter/router.tsx'),
    content: ArtTemplate.render(routerTpl, {})
  });
}
