import { cac } from 'cac';
import chalk from 'chalk';
import { exec } from 'child_process';
import { ServerOptions } from 'vite';
import pkg from '../package.json';
import { BuildOptions } from './build';

const cli = cac('viter');
const { log } = console;

// global options
interface GlobalCLIOptions {
  '--'?: string[];
  debug?: boolean | string;
  d?: boolean | string;
  filter?: string;
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
function cleanOptions(options: GlobalCLIOptions) {
  const ret = { ...options };
  delete ret['--'];
  delete ret.debug;
  delete ret.d;
  delete ret.filter;
  delete ret.f;
  delete ret.config;
  delete ret.c;
  delete ret.root;
  delete ret.base;
  delete ret.r;
  delete ret.mode;
  delete ret.m;
  delete ret.clearScreen;
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

cli.command('preview [root]').action(() => {
  exec('vite preview', (err) => {
    if (err) {
      log(chalk.red(err));
    }
  });
});

cli.help();

cli.version(pkg.version);

cli.parse();
