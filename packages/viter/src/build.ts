import { RollupOutput, RollupWatcher } from 'rollup';
import { build as viteBuild } from 'vite';
import { BuildOptions as ViteBuildOptions } from 'vite/dist/node/index';
import { renderer } from '@viterjs/renderer';
import { InlineConfig } from './interface';
import { resolveConfig, convertConfig } from './config';
import { Overwrite } from './utils';
import mountingCorePlugins from './plugins';

export type Manifest =
  | {
      fileName: string;
      filePath: string;
    }
  | boolean;

export interface ViterBuildOptions {
  manifest?: Manifest;
}

export declare type BuildOptions = Overwrite<ViteBuildOptions, ViterBuildOptions>;

export async function build(
  inlineConfig: InlineConfig
): Promise<RollupOutput | RollupOutput[] | RollupWatcher> {
  const resolvedConfig = await resolveConfig(inlineConfig, 'build', 'production');
  const viteConfig = convertConfig(resolvedConfig);
  renderer(resolvedConfig);
  if (Array.isArray(viteConfig.plugins)) {
    viteConfig.plugins = viteConfig.plugins?.concat(mountingCorePlugins(resolvedConfig));
  } else {
    viteConfig.plugins = mountingCorePlugins(resolvedConfig);
  }
  return viteBuild(viteConfig);
}
