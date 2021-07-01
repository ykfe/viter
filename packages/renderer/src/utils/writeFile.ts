import { dirname } from 'path';
import mkdirp from 'mkdirp';
import { EOL } from 'os';
import { existsSync, readFileSync, writeFileSync } from 'fs';

function writeFile({ path, content }: { path: string; content: string }): void {
  if (typeof path === 'string' && !/\.d\.ts$/.test(path) && /\.(ts|tsx)$/.test(path)) {
    content = `// @ts-nocheck${EOL}${content}`;
  }
  mkdirp.sync(dirname(path));
  if (!existsSync(path) || readFileSync(path, 'utf-8') !== content) {
    writeFileSync(path, content, 'utf-8');
  }
}

export default writeFile;
