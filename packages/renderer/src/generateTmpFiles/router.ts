import { readFileSync } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';
import { writeTmpFile } from '../utils/index';

export default function generateRouter(options: {}) {
  const routerTpl = readFileSync(resolve(__dirname, './router.tpl'), 'utf-8');

  writeTmpFile({
    path: resolve(__dirname, './router.tsx'),
    content: Mustache.render(routerTpl, {
      imports: `import 'global.less'`
    })
  });
}
