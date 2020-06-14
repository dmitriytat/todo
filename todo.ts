#!/usr/bin/env -S deno run --unstable --allow-write --allow-read --allow-env
import { Todo } from "./src/Todo.ts";
import { help } from "./src/ui.ts";
import { printLines } from "./src/terminal.ts";

const [command, ...args] = Deno.args;

const todo = new Todo();

switch (command) {
  case "add":
    await todo.add(args[0]);
    break;

  case "ls":
    await todo.list(false);
    break;

  case "edit":
    await todo.edit(parseInt(args[0], 10), args[1]);
    break;

  case "done":
    todo.done(parseInt(args[0], 10));
    break;

  case "undone":
    todo.undone(parseInt(args[0], 10));
    break;

  case "remove":
    todo.remove(parseInt(args[0], 10));
    break;

  case "help":
    await printLines(help);
    break;

  default:
    await todo.interactive();
}
