import { cac } from 'cac';
import pkg from '../package.json';
import { BuildOptions } from './build';

const cli = cac('viter');

// global options
interface GlobalCLIOptions {
  '--'?: string[];
  config?: string;
  c?: boolean | string;
  base?: string;
  mode?: string;
  m?: string;
}

cli
  .option('-c, --config <file>', `[string] use specified config file`)
  .option('-r, --root <path>', `[string] use specified root directory`)
  .option('--base <path>', `[string] public base path (default: /)`);

cli
  .command('[root]')
  .alias('serve')
  .option('-m, --mode <mode>', `[string] set env mode`)
  .action(async (root: string, options: GlobalCLIOptions) => {
    const { createServer } = await import('./server');
    try {
      const server = await createServer({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
      });
      await server.listen();
    } catch (e) {
      // TODO: add logger module
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
    const { build } = await import('./build');

    try {
      await build({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
      });
    } catch (e) {
      process.exit(1);
    }
  });

cli.command('preview [root]').action(() => {
  // code
});

cli.help();

cli.version(pkg.version);

cli.parse();
