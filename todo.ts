#!/usr/bin/env -S deno run --unstable --allow-write --allow-read --allow-env
import { Todo } from "./src/Todo.ts";
import { Operation }  from "./src/Operation.ts";
import { Data } from "./src/Data.ts";
import { Terminal } from "./src/Terminal.ts";
import { Task } from "./src/Task.ts";
import { help } from "./src/utils/ui.ts";

const [operation, ...args] = Deno.args;

const fileData = new Data<Task>("tasks.json");
const terminal = new Terminal();
const todo = new Todo(fileData, terminal);

switch (operation) {
    case Operation.add:
        await todo.add(args[0]);
        break;

    case Operation.edit:
        await todo.edit(parseInt(args[0], 10), args[1]);
        break;

    case Operation.ls :
        await todo.list(false);
        break;

    case Operation.done :
        todo.done(parseInt(args[0], 10));
        break;

    case Operation.undone :
        todo.undone(parseInt(args[0], 10));
        break;

    case Operation.remove :
        todo.remove(parseInt(args[0], 10));
        break;

    case Operation.help:
        await terminal.printLines(help);
        break;

    default:
        await todo.interactive();
}
