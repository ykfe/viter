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
});
