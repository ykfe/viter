import path from 'path';
import rollupBaseConfig from '../../rollup.config';

export default Object.assign(rollupBaseConfig, {
  input: {
    index: './src/index.ts',
    cli: './src/cli.ts',
  },
  output: {
    dir: path.resolve(__dirname, 'dist'),
    entryFileNames: `[name].js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    exports: 'named',
    format: 'cjs',
    sourcemap: true,
  },
  external: ['vite', '@viter/renderer', 'fsevents', 'anymatch', 'is-binary-path', 'object-assign'],
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
});
