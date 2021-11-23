import esbuild from 'esbuild';
import { resolve } from 'path';
import stylePlugin from './plugins/style/index';
import { esbuildPluginImport } from './plugins/styleImport';
// eslint-disable-next-line import/prefer-default-export
export async function start(options: { outDir?: string }): Promise<void> {
  const { outDir } = options;
  await esbuild.build({
    entryPoints: [`${process.cwd()}/.viter/entry.tsx`],
    target: ['es6'],
    platform: 'browser',
    format: 'esm',
    bundle: true,
    entryNames: 'index.esm',
    assetNames: 'index',
    outdir: resolve(process.cwd(), outDir ?? './dist'),
    minify: false,
    // resolveExtensions: ['.tsx', '.jsx', '.ts', '.js'],
    plugins: [
      stylePlugin({ less: { javascriptEnabled: true } }),
      esbuildPluginImport([{ libraryName: 'antd', libraryDirectory: 'es', style: true }]),
    ],
  });
}
