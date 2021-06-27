import { readFileSync } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';
import { writeTmpFile } from '../utils/index';

export default function generateRouter(): void {
  const routerTpl = readFileSync(resolve(__dirname, './tplFiles/router.tpl'), 'utf-8');

  writeTmpFile({
    path: resolve(process.cwd(), './src/.viter/router.tsx'),
    content: Mustache.render(routerTpl, {})
  });
}
