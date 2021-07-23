import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import strip from '@rollup/plugin-strip';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const input = './src/index.ts';
const extensions = ['.ts', '.tsx'];
const dist = path.resolve(process.cwd(), 'dist');

export default {
  input,
  external: [/@babel\/runtime/],
  plugins: [
    resolve({ extensions, preferBuiltins: true }),
    commonjs(),
    del({ targets: dist }),
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
