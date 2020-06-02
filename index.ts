#!/usr/bin/env -S deno run --unstable --allow-write --allow-read --allow-env
import {decode} from 'https://deno.land/std@v0.51.0/encoding/utf8.ts';

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
            const buffer = new Uint8Array(3);
            Deno.setRaw(0, true);
            await Deno.stdin.read(buffer);
            Deno.setRaw(0, false);

            const key = decode(buffer);

            if (key === '\u001B\u005B\u0041') {
                app.up();
            } else if (key === '\u001B\u005B\u0043') {
                app.down();
            } else if (key === '\u001B\u005B\u0042') {
                app.down();
            } else if (key === '\u001B\u005B\u0044') {
                app.up();
            } else if (key.charAt(0) === ' ') {
                app.toggleCurrent();
            } else if (key.charAt(0) === '\u0003') {
                break;
            }
        }
}
