import { BuildOptions as ViteBuildOptions } from 'vite/dist/node/index';
import { Overwrite } from '../utils';

export type Manifest =
  | {
      fileName: string;
      filePath: string;
    }
  | boolean;

export interface ViterBuildOptions {
  manifest?: Manifest;
  runtimePublicPath?: { preloadBaseMarker?: string };
}

export declare type BuildOptions = Overwrite<ViteBuildOptions, ViterBuildOptions>;
