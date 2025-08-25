#!/usr/bin/env node
import { Command } from 'commander'
import { addComponent } from '../commands/addComponent.js'
import chalk from "chalk";
import figlet from "figlet";
import list from "../commands/list.js";

const program = new Command()

program
    .name('scaffold')
    .version('1.0.0', '-v, --version', 'output the current version')
    .description('Custom UI component generator')

// Add custom help text before the built-in help
program.addHelpText('before', () => {
    const banner = chalk.cyan(
        figlet.textSync("Scaffold", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default"
        })
    );
    
    const description = chalk.bold(
        "This is a UI library of components which are very easy to import and use"
    );
    
    const importInfo = chalk.blue("How to import components:") + "\n" + 
                      chalk.green("   import { Button } from '@/components/ui/button'");
    
    return banner + "\n\n" + description + "\n\n" + importInfo + "\n\n";
});

program
  .command('add <component-name>')
  .description('Add a new component')
  .action(addComponent)

program
    .command('list')
    .description('List all the components')
    .action(list)

program.parse()

