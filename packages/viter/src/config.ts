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
  routes?: IRoute;
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

export type InlineConfig = Overwrite<ViteInlineConfig, { configFile?: string }>;

export interface ResolvedConfig {
  configFile?: string;
  config: UserConfig;
}

export function defineConfig(config: UserConfig) {
  return config;
}

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

  return {
    configFile,
    config: config || {},
  };
}

export function convertConfig({ configFile, config: userConfig = {} }: ResolvedConfig) {
  const defaultViteConfig = {
    configFile: false,
    server: {
      watch: {
        ignored: configFile,
      },
    },
  };
  const config = mergeConfig(defaultViteConfig, userConfig);

  delete config.routes;
  delete config.dynamicImport;

  if (config.build && config.build.manifest) {
    config.build.manifest = true;
  }

  return config;
}
