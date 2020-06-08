#!/usr/bin/env -S deno run --unstable --allow-write --allow-read --allow-env
import {hideCursor, readKeypress, showCursor} from "./dep.ts";

import {Todo} from './src/Todo.ts';
import {ask, print} from './src/utils/print.ts';
import {help} from "./ui.ts";

const [operation, argument] = Deno.args;

enum Operation {
    'add' = 'add',
    'done' = 'done',
    'undone' = 'undone',
    'remove' = 'remove',
    'ls' = 'ls',
    'help' = 'help',
}

const todo = new Todo();

switch (operation) {
    case Operation.add:
        await todo.add(argument);
        break;

    case Operation.ls :
        await todo.list(false);
        break;

    case Operation.done :
        todo.done(parseInt(argument, 10));
        break;

    case Operation.undone :
        todo.undone(parseInt(argument, 10));
        break;

    case Operation.remove :
        todo.remove(parseInt(argument, 10));
        break;

    case Operation.help:
        await print(help);
        break;

    case undefined:
    default:
        while (true) {
            await hideCursor();
            await todo.list(true);

            const events = await readKeypress();

            for (const event of events) {
                if (event.key === 'up' || event.key === 'left') {
                    todo.up();
                } else if (event.key === 'down' || event.key === 'right') {
                    todo.down();
                } else if (event.key === 'd' || event.key === 'space') {
                    todo.toggle();
                } else if (event.key === 'r' || event.key === 'delete') {
                    todo.remove();
                } else if (event.key === 'a') {
                    const title = await ask("Add todo: ");

                    if (title) {
                        await todo.add(title);
                    }
                } else if (event.key === 'e') {
                    const task = todo.getCurrent();
                    task.title = await ask("Edit todo (" + task.title + "): ");
                    await todo.write();
                } else if (event.ctrlKey && event.key === 'c') {
                    await showCursor();
                    Deno.exit(0)
                }
            }
        }
}
