import chokidar, { FSWatcher } from 'chokidar';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { renderer } from '@viter/renderer';
import { resolveConfig, convertConfig, InlineConfig, UserConfig, ResolvedConfig } from './config';

export interface ServerOptions {
  placeholder: string;
}

export interface ViterDevServer {
  /**
   * The resolved viter config object
   */
  config: ResolvedConfig;
  /**
   * Start the server.
   */
  viteServer: ViteDevServer;
  /**
   * Start the server.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>;
  /**
   * Stop the server.
   */
  close(): Promise<void>;
}

export const createServer = async (inlineConfig: InlineConfig): Promise<ViterDevServer> => {
  const config = await resolveConfig(inlineConfig, 'serve', 'development');
  const viteConfig = convertConfig(config);

  const { configFile } = config;

  // generate or write route files
  renderer(config);

  // create dev server by vite
  const viteServer = await createViteServer(viteConfig);

  // watch viter config file
  const watcher: FSWatcher = chokidar.watch(configFile || [], {
    ignoreInitial: true,
    ignorePermissionErrors: true,
    disableGlobbing: true,
  });

  const server = {
    config,
    viteServer,
    listen(port?: number, isRestart?: boolean) {
      return viteServer.listen(port, isRestart);
    },
    async close() {
      await Promise.all([watcher.close(), viteServer.close()]);
    },
  };

  watcher.on('change', () => {
    restartServer(server);
  });

  return server;
};

const restartServer = async (server: ViterDevServer) => {
  let newServer: ViterDevServer | null = null;

  try {
    newServer = await createServer(server.config.inlineConfig);
  } catch (err) {
    return;
  }

  await server.close();

  (Object.keys(newServer) as Array<keyof ViteDevServer>).forEach((key) => {
    if (key !== 'app') {
      // @ts-ignore
      server[key] = newServer[key];
    }
  });

  if (!server.viteServer.config.server.middlewareMode) {
    await server.listen(undefined, true);
  } else {
    server.viteServer.config.logger.info('server restarted.', { timestamp: true });
  }
};
