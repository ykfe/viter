import esbuild from 'esbuild';
import stylePlugin from './plugins/style/index';
import { esbuildPluginImport } from './plugins/styleImport';

export default async function start() {
  await esbuild.build({
    entryPoints: [`${process.cwd()}/.viter/entry.tsx`],
    target: ['es6'],
    format: 'esm',
    bundle: true,
    entryNames: 'index.esm',
    assetNames: 'index',
    outdir: 'build',
    minify: true,
    plugins: [
      stylePlugin({ less: { javascriptEnabled: true } }),
      esbuildPluginImport([{ libraryName: 'antd', libraryDirectory: 'es', style: 'css' }]),
    ],
  });
}
