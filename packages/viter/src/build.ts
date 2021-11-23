import { RollupOutput, RollupWatcher } from 'rollup';
import { build as viteBuild } from 'vite';
import { BuildOptions as ViteBuildOptions } from 'vite/dist/node/index';
import { renderer } from '@viterjs/renderer';
import { InlineConfig } from './interface';
import { resolveConfig, convertConfig } from './config';
import { Overwrite } from './utils';

export type Manifest =
  | {
      fileName: string;
      filePath: string;
    }
  | boolean;

export interface ViterBuildOptions {
  manifest?: Manifest;
  esbuild?: boolean;
}

export declare type BuildOptions = Overwrite<ViteBuildOptions, ViterBuildOptions>;

export async function build(
  inlineConfig: InlineConfig,
  buildMode: 'default' | 'esbuild'
): Promise<RollupOutput | RollupOutput[] | RollupWatcher | void> {
  const resolvedConfig = await resolveConfig(inlineConfig, 'build', 'production');
  const viteConfig = convertConfig(resolvedConfig);

  renderer(resolvedConfig);
  if (buildMode === 'esbuild') {
    const { start } = await import('./esbuild/build');
    const outDir = viteConfig?.build?.outDir;
    return start({ outDir });
  }
  return viteBuild(viteConfig);
}
