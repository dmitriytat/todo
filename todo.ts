#!/usr/bin/env -S deno run --unstable --allow-write --allow-read --allow-env
import { readKeypress } from 'https://raw.githubusercontent.com/dmitriytat/keypress/0.0.1/mod.ts';

import {App} from './src/App.ts';
import {print} from './src/print.ts';

const [operation, argument] = Deno.args;

enum Operation {
    'add' = 'add',
    'done' = 'done',
    'undone' = 'undone',
    'remove' = 'remove',
    'ls' = 'ls',
    'help' = 'help',
}

const app = new App();

switch (operation) {
    case Operation.add:
        app.add(argument);
        break;

    case Operation.done :
        app.done(parseInt(argument, 10));
        break;

    case Operation.undone :
        app.undone(parseInt(argument, 10));
        break;

    case Operation.remove :
        app.remove(parseInt(argument, 10));
        break;

    case Operation.ls :
        await app.list(false);
        break;

    case Operation.help:
        await print(
            `
run without params:
- to work in interactive mode

run with params:
ls - to show list of tasks

add "task"   - to add task
done index   - to check task as done
undone index - to check task as undone
remove index - to remove task
`
        );
        break;

    case undefined:
    default:
        while (true) {
            await app.list(true);

            const events = await readKeypress();

            events.forEach(event => {
                if (event.key === 'up') {
                    app.up();
                } else if (event.key === 'down') {
                    app.down();
                } else if (event.key === 'right') {
                    app.down();
                } else if (event.key === 'left') {
                    app.up();
                } else if (event.key === 'space') {
                    app.toggleCurrent();
                } else if (event.ctrlKey && event.key === 'c') {
                    Deno.exit(0)
                }
            })
        }
}
