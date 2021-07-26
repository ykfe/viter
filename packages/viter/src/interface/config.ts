import { UserConfig as ViteUserConfig, InlineConfig as ViteInlineConfig } from 'vite';
import { IRoute, IDynamicImport } from '@viterjs/renderer';
import { Overwrite } from '../utils';
import { BuildOptions } from './build';

export interface ConfigEnv {
  command: 'build' | 'serve';
  mode: string;
}

export type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>;
export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn;

interface ViterUserConfig {
  /**
   * Base public path when served in development or production.
   * @default '/'
   */
  base?: string;
  /**
   * Base public path when served in development or production.
   * @default '/'
   */
  routes?: IRoute[];
  /**
   * Base public path when served in development or production.
   * @default '/'
   */
  dynamicImport?: IDynamicImport;
  /**
   * Build specific options
   */
  build?: BuildOptions;
}

export type UserConfig = Overwrite<ViteUserConfig, ViterUserConfig>;

export type InlineConfig = UserConfig & Overwrite<ViteInlineConfig, { configFile?: string }>;

export type ResolvedConfig = UserConfig & {
  configFile: string | undefined;
  inlineConfig: InlineConfig;
};
