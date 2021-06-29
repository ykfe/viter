import { cac } from 'cac';
import pkg from '../package.json';

const cli = cac('viter');

cli.command('preview [root]').action(() => {
  // code
});

cli.help();

cli.version('222.0.0');
