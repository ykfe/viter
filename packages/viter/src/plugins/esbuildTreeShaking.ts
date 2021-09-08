import { Plugin } from 'vite';
import { build, Plugin as EsbuildPlugin } from 'esbuild';
import { resolve, dirname } from 'path';
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

const externalPlugin: EsbuildPlugin = {
  name: 'external-all',
  setup({ onResolve }) {
    onResolve({ filter: /()/ }, (args) => {
      if (args.kind !== 'entry-point') return { path: args.path, external: true };
    });
  },
};
const EsbuildTreeShaking = (): Plugin => {
  let target: string | string[] = 'es2015';
  return {
    enforce: 'post',
    apply: 'build',
    name: 'esbuild-treeshake',
    config(config) {
      if (config?.build?.target) {
        target = config.build.target;
      }
    },
    async generateBundle({ format }, bundle) {
      if (format !== 'es') {
        return;
      }
      const promises = Object.keys(bundle).map(async (file) => {
        const chunk = bundle[file];
        if (chunk.type === 'chunk') {
          // fs.writeFileSync(path.resolve(process.cwd(), `./.viter/${chunk.fileName}`), chunk.code, 'utf-8')
          writeFile({
            path: resolve(process.cwd(), `./.viter/output/${chunk.fileName}`),
            content: chunk.code,
          });
          const res = await build({
            entryPoints: [resolve(process.cwd(), `./.viter/output/${chunk.fileName}`)],
            bundle: true,
            minify: true,
            treeShaking: true,
            write: false,
            plugins: [externalPlugin],
            format: 'esm',
            target,
            outfile: `./.viter/out.${chunk.fileName}`,
          });
          if (res.errors.length === 0 && res.outputFiles.length === 1) {
            chunk.code = res.outputFiles[0].text;
          }
        }
      });
      await Promise.all(promises);
    },
  };
};
export default EsbuildTreeShaking;
