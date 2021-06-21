import { readFileSync } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';
import { writeTmpFile } from '../utils/index';

export default function generateRouter(options: {}) {
  const routesTpl = readFileSync(resolve(__dirname, './routes.tpl'), 'utf-8');

  writeTmpFile({
    path: resolve(__dirname, './router.tsx'),
    content: Mustache.render(routesTpl, {
      imports: `import 'global.less'`
    })
  });
}
