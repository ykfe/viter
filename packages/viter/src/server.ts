import chokidar from 'chokidar';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { renderer } from '@viter/renderer';
import { resolveConfig, convertConfig, InlineConfig, UserConfig } from './config';

export interface ServerOptions {
  placeholder: string;
}

export const createServer = async (inlineConfig: InlineConfig): Promise<ViteDevServer> => {
  const resolvedConfig = await resolveConfig(inlineConfig, 'serve', 'development');
  const viteConfig = convertConfig(resolvedConfig);

  const { configFile, config } = resolvedConfig;

  // generate or write route files
  renderer(config);

  // create dev server by vite
  const server = await createViteServer(viteConfig);

  if (configFile) {
    const watcher = chokidar.watch(configFile, {
      ignoreInitial: true,
      ignorePermissionErrors: true,
      disableGlobbing: true,
    });

    watcher.on('change', () => {
      restartServer(server, config);
    });
  }

  return server;
};

const restartServer = async (server: ViteDevServer, config: UserConfig) => {
  let newServer: ViteDevServer | null = null;

  try {
    newServer = await createViteServer(server.config.inlineConfig);
  } catch (err) {
    return;
  }

  await server.close();

  // generate or write route files
  renderer(config);

  (Object.keys(newServer) as Array<keyof ViteDevServer>).forEach((key) => {
    if (key !== 'app') {
      // @ts-ignore
      server[key] = newServer[key];
    }
  });

  if (!server.config.server.middlewareMode) {
    await server.listen(undefined, true);
  } else {
    server.config.logger.info('server restarted.', { timestamp: true });
  }
};
