import path from 'path';
import { cloneDeep, merge } from 'lodash';
import rollupBaseConfig from '../../rollup.config';
import pkg from './package.json';

const external = [
  'fsevents',
  'anymatch',
  'is-binary-path',
  'object-assign',
  'rollup-plugin-terser',
  ...Object.keys(pkg.peerDependencies),
];

export default [
  merge(cloneDeep(rollupBaseConfig), {
    input: {
      index: './src/index.ts',
      cli: './src/cli.ts',
    },
    output: {
      dir: path.resolve(__dirname, 'dist/cjs'),
      entryFileNames: `[name].js`,
      chunkFileNames: 'chunks/dep-[hash].js',
      exports: 'named',
      format: 'cjs',
      sourcemap: true,
    },
    external,
    onwarn(warning, warn) {
      // vite use the eval('require') trick to deal with optional deps
      if (warning.message.includes('Use of eval')) {
        return;
      }
      if (warning.message.includes('Circular dependency')) {
        return;
      }
      warn(warning);
    },
  }),
  merge(cloneDeep(rollupBaseConfig), {
    input: {
      runtime: './src/runtime.ts',
    },
    output: {
      dir: path.resolve(__dirname, 'dist/esm'),
      entryFileNames: `[name].js`,
      chunkFileNames: 'chunks/dep-[hash].js',
      format: 'es',
      sourcemap: true,
    },
    external,
    onwarn(warning, warn) {
      // vite use the eval('require') trick to deal with optional deps
      if (warning.message.includes('Use of eval')) {
        return;
      }
      if (warning.message.includes('Circular dependency')) {
        return;
      }
      warn(warning);
    },
  }),
];
