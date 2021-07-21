import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import strip from '@rollup/plugin-strip';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const input = './src/index.ts';
const extensions = ['.ts', '.tsx'];

export default {
  input,
  external: [/@babel\/runtime/],
  plugins: [
    resolve({ extensions, preferBuiltins: true }),
    commonjs(),
    json(),
    babel({
      extensions,
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
    strip({ debugger: true }),
    sizeSnapshot({ printInfo: false }),
  ],
};
