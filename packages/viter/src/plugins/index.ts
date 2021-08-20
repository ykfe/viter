import { Plugin } from 'vite';
import usePreloadRuntimePublicPath from './preloadRuntimePublicPath';
import { ResolvedConfig } from '../interface';

const mountingCorePlugins = (config: ResolvedConfig): Array<Plugin | null> =>
  // 开启runtimePublicPath插件
  [
    config?.build?.runtimePublicPath
      ? usePreloadRuntimePublicPath(config?.build?.runtimePublicPath)
      : null,
  ];
export default mountingCorePlugins;
