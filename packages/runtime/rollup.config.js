import rollupBaseConfig from '../../rollup.config';
import pkg from './package.json';

export default Object.assign(rollupBaseConfig, {
  output: [
    {
      file: pkg.main,
      format: 'esm',
      exports: 'auto',
    },
  ],
  external: Object.keys(pkg.peerDependencies),
});
