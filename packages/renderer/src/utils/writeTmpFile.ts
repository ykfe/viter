import { dirname } from 'path';
import mkdirp from 'mkdirp';
import { EOL } from 'os';
import { existsSync, readFileSync, writeFileSync } from 'fs';

function writeFile({ path, content }: { path: string; content: string }) {
  console.log(dirname(path), 'test');
  mkdirp.sync(dirname(path));
  if (!existsSync(path) || readFileSync(path, 'utf-8') !== content) {
    writeFileSync(path, content, 'utf-8');
  }
}
const isTSFile = (path: string): boolean =>
  typeof path === 'string' && !/\.d\.ts$/.test(path) && /\.(ts|tsx)$/.test(path);

function writeTmpFile({
  path,
  content,
  skipTSCheck = true
}: {
  path: string;
  content: string;
  skipTSCheck?: boolean;
}): void {
  if (isTSFile(path) && skipTSCheck) {
    // write @ts-nocheck into first line
    content = `// @ts-nocheck${EOL}${content}`;
  }
  writeFile({
    path,
    content
  });
}

export default writeTmpFile;
