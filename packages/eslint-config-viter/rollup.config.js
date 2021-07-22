import rollupBaseConfig from '../../rollup.config';
import pkg from './package.json';

export default Object.assign(rollupBaseConfig, {
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'auto',
    },
  ],
});
