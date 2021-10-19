import fs from 'fs';
import path from 'path';
import { loadConfigFromFile, mergeConfig, UserConfig as ViteUserConfig } from 'vite';
import _merge from 'lodash.merge';
import { UserConfigExport, UserConfig, InlineConfig, ResolvedConfig } from './interface';
import mountingCorePlugins from './plugins';

const PRE_CONFIG = {
  single: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'index[extname]',
        entryFileNames: 'index.esm.js',
        manualChunks: {},
      },
    },
  },
  split: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: 'index.[hash][extname]',
        entryFileNames: 'index.esm.js',
      },
    },
  },
  'split-js': {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'index[extname]',
        entryFileNames: 'index.esm.js',
      },
    },
  },
};

export function defineConfig(config: UserConfigExport): UserConfigExport {
  return config;
}

export function lookupConfigFile(
  configRoot: string = process.cwd(),
  configFile?: string
): string | undefined {
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

  const mode = config.mode || defaultMode;
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

export function convertConfig(config: ResolvedConfig): ViteUserConfig {
  const { configFile } = config;
  const innerConfig = {
    configFile: false,
    server: {
      watch: {
        ignored: [configFile],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '@viter-entry': path.resolve(process.cwd(), '.viter'),
      },
    },
  };
  // 加载预置打包配置
  if (config?.build?.buildMode) {
    const buildConfig = PRE_CONFIG[config.build.buildMode];
    config.build = _merge(config.build, buildConfig);
  }

  const viteConfig = mergeConfig(config, innerConfig);

  delete viteConfig.routes;
  delete viteConfig.dynamicImport;

  if (viteConfig.build && viteConfig.build.manifest) {
    viteConfig.build.manifest = true;
  }
  // 加载内置插件
  if (Array.isArray(viteConfig.plugins)) {
    viteConfig.plugins = viteConfig.plugins?.concat(mountingCorePlugins(config));
  } else {
    viteConfig.plugins = mountingCorePlugins(config);
  }

  return viteConfig;
}
