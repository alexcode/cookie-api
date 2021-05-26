#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import program from 'commander';

clear();
console.log(
  chalk.red(
    figlet.textSync('open-cookie-cli', { horizontalLayout: 'full' })
  )
);


  // program.exitOverride();
  program
  .version('0.0.1')
  .command('populate', 'Populate the initial DB', { executableFile: 'populate' })
  .command('translate <lang>', 'Translate the description', { executableFile: 'translate' })
  .command('generate', 'Transform data into a static API', { executableFile: 'generate' });
  program.parse(process.argv);
