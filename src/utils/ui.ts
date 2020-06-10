import { bold, green, red, yellow } from "../../dep.ts";
import { Task } from "../Task.ts";

export const help = `run without params:
- to work in interactive mode

run with params:
ls - to show list of tasks

add "task"        - to add task
edit index "task" - to edit task
done index        - to check task as done
undone index      - to check task as undone
remove index      - to remove task`;

const toolbar = `${yellow("d")}one ${yellow("a")}dd ${yellow("e")}dit ${yellow("r")}emove`;

export function leftPad(message: string, length: number, character: string = " ",) {
  if (message.length >= length) {
    return message;
  }

  let pad = "";
  for (let i = message.length; i < length; i++) {
    pad = character + pad;
  }

  return pad + message;
}

export function formatTaskList(tasks: Task[], showToolbar: boolean = false, activeIndex?: number): string {
  const title = `${bold("TODO LIST:")}`;

  const list = tasks.map((task, index) => {
    const number = yellow(leftPad(index.toString(), 2, "0"));
    const checkbox = task.isDone ? green("[*]") : red("[ ]");
    const isActive = activeIndex === index;
    const title = isActive ? bold(yellow(task.title)) : task.title;

    return `${number} ${checkbox} ${title}`;
  });

  const lines = [
    title,
    ...list,
  ];

  if (showToolbar) {
    lines.push(toolbar);
  }

  return lines.join("\n");
}
