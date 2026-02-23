#!/usr/bin/env node

/**
 * @minions-tasks/cli — CLI for Minions Tasks
 */

import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
    .name('tasks')
    .description('Task and work management across agents, humans, and workflows')
    .version('0.2.2');

program
    .command('info')
    .description('Show project info')
    .action(() => {
        console.log(chalk.bold('Minions Tasks'));
        console.log(chalk.dim('Task and work management across agents, humans, and workflows'));
        console.log('');
        console.log(`  SDK:    ${chalk.cyan('@minions-tasks/sdk')}`);
        console.log(`  CLI:    ${chalk.cyan('@minions-tasks/cli')}`);
        console.log(`  Python: ${chalk.cyan('minions-tasks')}`);
    });

program.parse();
