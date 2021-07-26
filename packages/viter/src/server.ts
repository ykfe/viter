import chokidar, { FSWatcher } from 'chokidar';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { renderer } from '@viterjs/renderer';
import { resolveConfig, convertConfig } from './config';
import { InlineConfig, ViterDevServer } from './interface';

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

export async function restartServer(server: ViterDevServer): Promise<void> {
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
}
