import { Plugin } from 'vite';
import esbuildTreeShaking from './EsbuildTreeShaking';
import usePreloadRuntimePublicPath from './preloadRuntimePublicPath';
import { ResolvedConfig } from '../interface';

const mountingCorePlugins = (config: ResolvedConfig): Array<Plugin | null> => [
  // 开启runtimePublicPath插件
  config?.build?.runtimePublicPath
    ? usePreloadRuntimePublicPath(config?.build?.runtimePublicPath)
    : null,
  // 代码tree-shaking
  config?.build?.minify === 'esbuild' ? esbuildTreeShaking() : null,
];
export default mountingCorePlugins;
