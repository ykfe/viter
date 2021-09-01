import { Plugin } from 'vite';
import { terser } from 'rollup-plugin-terser';
import usePreloadRuntimePublicPath from './preloadRuntimePublicPath';
import { ResolvedConfig } from '../interface';

const mountingCorePlugins = (config: ResolvedConfig): Array<Plugin | null> => [
  // 开启runtimePublicPath插件
  config?.build?.runtimePublicPath
    ? usePreloadRuntimePublicPath(config?.build?.runtimePublicPath)
    : null,
  // 代码tree-shaking
  config?.build?.minify === 'esbuild'
    ? {
        apply: 'build',
        enforce: 'post',
        ...terser({ compress: { defaults: false, unused: true }, mangle: false }),
      }
    : null,
];
export default mountingCorePlugins;
