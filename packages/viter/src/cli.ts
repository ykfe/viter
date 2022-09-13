import { cac } from 'cac';
import chalk from 'chalk';
import { ServerOptions, preview, resolveConfig, createLogger, LogLevel } from 'vite';
import pkg from '../package.json';
import { BuildOptions } from './build';
import { lookupConfigFile } from './config';

const cli = cac('viter');
const { log } = console;

// global options
interface GlobalCLIOptions {
  '--'?: string[];
  debug?: boolean | string;
  d?: boolean | string;
  filter?: string;
  l?: LogLevel;
  logLevel?: LogLevel;
  f?: string;
  config?: string;
  c?: boolean | string;
  root?: string;
  base?: string;
  r?: string;
  mode?: string;
  m?: string;
  clearScreen?: boolean;
}

/**
 * removing global flags before passing as command specific sub-configs
 */
function cleanOptions<Options extends GlobalCLIOptions>(
  options: Options
): Omit<Options, keyof GlobalCLIOptions> {
  const ret = { ...options };
  delete ret['--'];
  delete ret.c;
  delete ret.config;
  delete ret.r;
  delete ret.root;
  delete ret.base;
  delete ret.l;
  delete ret.logLevel;
  delete ret.clearScreen;
  delete ret.d;
  delete ret.debug;
  delete ret.f;
  delete ret.filter;
  delete ret.m;
  delete ret.mode;
  return ret;
}

cli
  .option('-c, --config <file>', `[string] use specified config file`)
  .option('-r, --root <path>', `[string] use specified root directory`)
  .option('--base <path>', `[string] public base path (default: /)`);

cli
  .command('[root]')
  .alias('serve')
  .option('-m, --mode <mode>', `[string] set env mode`)
  .option('--force', `[boolean] force the optimizer to ignore the cache and re-bundle`)
  .action(async (root: string, options: ServerOptions & GlobalCLIOptions) => {
    const VITE_START_TIME = Date.now();
    const { createServer } = await import('./server');

    try {
      const server = await createServer({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        server: cleanOptions(options) as ServerOptions,
      });
      await server.listen();
      // log url info
      server.viteServer.printUrls();
      log(chalk.blue(`\n  ready in ${Date.now() - VITE_START_TIME}ms.\n`));
    } catch (e) {
      log(chalk.red(e));
      process.exit(1);
    }
  });

cli
  .command('build [root]')
  .option('--target <target>', `[string] transpile target (default: 'modules')`)
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .option('--emptyOutDir', `[boolean] force empty outDir when it's outside of root`)
  .option('-m, --mode <mode>', `[string] set env mode`)
  .option('-e, --esbuild', `[boolean] set esbuild mode`)
  .option('-w, --watch', `[boolean] rebuilds when modules have changed on disk`)
  .action(async (root: string, options: BuildOptions & GlobalCLIOptions) => {
    const VITE_START_TIME = Date.now();
    const { build } = await import('./build');

    try {
      await build({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
      });
      log(chalk.blue(`\n  finished in ${Date.now() - VITE_START_TIME}ms.\n`));
    } catch (e) {
      log(chalk.red(e));
      process.exit(1);
    }
  });

cli
  .command('preview [root]')
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .option('--https', `[boolean] use TLS + HTTP/2`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .action(
    async (
      root: string,
      options: {
        host?: string | boolean;
        port?: number;
        https?: boolean;
        open?: boolean | string;
        strictPort?: boolean;
        logLevel?: LogLevel;
      } & GlobalCLIOptions
    ) => {
      try {
        const server = await preview({
          root,
          base: options.base,
          configFile: options.config || lookupConfigFile(root, options.config),
          logLevel: options.logLevel,
          mode: options.mode,
          preview: {
            port: options.port,
            strictPort: options.strictPort,
            host: options.host,
            https: options.https,
            open: options.open,
          },
        });
        server.printUrls();
      } catch (e: any) {
        createLogger(options.logLevel).error(
          chalk.red(`error when starting preview server:\n${e?.stack}`),
          { error: e }
        );
        process.exit(1);
      }
    }
  );

cli.help();

cli.version(pkg.version);

cli.parse();
