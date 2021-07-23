import { ViteDevServer } from 'vite';
import { ResolvedConfig } from './config';

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
