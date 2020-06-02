#!/usr/bin/env -S deno run --unstable --allow-write --allow-read --allow-env

import {App} from './src/App.ts';
import {decode} from "https://deno.land/std@v0.51.0/encoding/utf8.ts";

const [operation, argument] = Deno.args;

enum Operation {
    'add' = 'add',
    'done' = 'done',
    'undone' = 'undone',
    'remove' = 'remove',
    'show' = 'show',
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

    case Operation.show :
        await app.show();
        break;

    case Operation.help:
        console.log('help');
        break;

    case undefined:
    default:
        while (true) {
            await app.show();
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
