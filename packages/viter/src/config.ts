import fs from 'fs';
import path from 'path';
import {
  UserConfig as ViteUserConfig,
  InlineConfig as ViteInlineConfig,
  loadConfigFromFile,
  mergeConfig,
} from 'vite';
import { IRoute, IDynamicImport } from '@viter/renderer';
import { BuildOptions } from './build';
import { Overwrite } from './utils';

export interface ConfigEnv {
  command: 'build' | 'serve';
  mode: string;
}

export type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>;
export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn;

export function defineConfig(config: UserConfigExport) {
  return config;
}

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

export function lookupConfigFile(configRoot: string = process.cwd(), configFile?: string) {
  let resolvedPath: string | undefined;

  if (configFile) {
    resolvedPath = path.resolve(configFile);
  } else {
    const jsconfigFile = path.resolve(configRoot, 'viter.config.js');
    if (fs.existsSync(jsconfigFile)) {
      resolvedPath = jsconfigFile;
    }

    if (!resolvedPath) {
      const mjsconfigFile = path.resolve(configRoot, 'viter.config.mjs');
      if (fs.existsSync(mjsconfigFile)) {
        resolvedPath = mjsconfigFile;
      }
    }

    if (!resolvedPath) {
      const tsconfigFile = path.resolve(configRoot, 'viter.config.ts');
      if (fs.existsSync(tsconfigFile)) {
        resolvedPath = tsconfigFile;
      }
    }
  }

  return resolvedPath;
}

export async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolvedConfig> {
  let config = inlineConfig;
  let mode = inlineConfig.mode || defaultMode;

  const configFile = lookupConfigFile(config.root, config.configFile);
  const configEnv = { mode, command };

  const loadResult: {
    path: string;
    config: UserConfig;
  } | null = await loadConfigFromFile(configEnv, configFile, config.root);

  if (loadResult) {
    config = mergeConfig(loadResult.config, config);
  }

  const resolved: ResolvedConfig = {
    ...config,
    configFile,
    inlineConfig,
  };

  return resolved;
}

export function convertConfig(config: ResolvedConfig) {
  const { configFile } = config;
  const innerConfig = {
    configFile: false,
    server: {
      watch: {
        ignored: [configFile],
      },
    },
  };
  const viteConfig = mergeConfig(config, innerConfig);

  delete viteConfig.routes;
  delete viteConfig.dynamicImport;

  if (viteConfig.build && viteConfig.build.manifest) {
    viteConfig.build.manifest = true;
  }

  return viteConfig;
}
