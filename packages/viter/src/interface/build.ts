import { BuildOptions as ViteBuildOptions } from 'vite/dist/node/index';
import { Overwrite } from '../utils';

export type Manifest = string | boolean;

export interface ViterBuildOptions {
  manifest?: Manifest;
  runtimePublicPath?: { preloadBaseMarker?: string };
  buildMode?: 'single' | 'split-js' | 'split';
}

export declare type BuildOptions = Overwrite<ViteBuildOptions, ViterBuildOptions>;
