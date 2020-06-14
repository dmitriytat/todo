import {
  writeJsonSync,
  readJsonSync,
  ensureFileSync,
} from "https://deno.land/std/fs/mod.ts";
import {
  printInteractive,
  printLines,
  readKeypress,
  prompt,
} from "./terminal.ts";
import { formatTaskList } from "./ui.ts";
import { Task } from "./Task.ts";

export class Todo {
  private currentIndex: number = 0;
  tasks: Task[] = [];

  constructor(private file: string = "tasks.json") {
    this.open();
  }

  open() {
    try {
      ensureFileSync(this.file);
      this.tasks = readJsonSync(this.file) as Task[];
    } catch (e) {
      console.log(e);
      this.tasks = [];
    }
  }

  save() {
    writeJsonSync(this.file, this.tasks, { spaces: 2 });
  }

  up() {
    this.currentIndex = this.currentIndex === 0
      ? this.tasks.length - 1
      : this.currentIndex - 1;
  }

  down() {
    this.currentIndex = this.currentIndex === this.tasks.length - 1
      ? 0
      : this.currentIndex + 1;
  }

  async list(interactive: boolean = false) {
    if (interactive) {
      await printInteractive(
        formatTaskList(this.tasks, true, this.currentIndex),
      );
    } else {
      await printLines(formatTaskList(this.tasks, false));
    }
  }

  toggle(index: number = this.currentIndex) {
    const task = this.tasks[index];

    if (task) {
      task.isDone = !task.isDone;
      this.save();
    }
  }

  done(index: number): void {
    const task = this.tasks[index];

    if (task) {
      task.isDone = true;
      this.save();
    }
  }

  undone(index: number): void {
    const task = this.tasks[index];

    if (task) {
      task.isDone = false;
      this.save();
    }
  }

  add(title: string) {
    if (!title) {
      return;
    }

    const task: Task = {
      title,
      isDone: false,
    };

    this.tasks.push(task);
    this.save();
  }

  edit(index: number, title: string) {
    const task = this.tasks[index];

    if (task) {
      task.title = title;
      this.save();
    }
  }

  remove(index: number = this.currentIndex) {
    if (index === this.tasks.length - 1) {
      this.up();
    }

    this.tasks.splice(index, 1);
    this.save();
  }

  async interactive() {
    while (true) {
      await this.list(true);
      const key = await readKeypress();

      if (key === "\u001B\u005B\u0041" || key === "\u001B\u005B\u0044") { // вверх или влево
        this.up();
      } else if (key === "\u001B\u005B\u0042" || key === "\u001B\u005B\u0043") {
        // вниз или вправо
        this.down();
      } else if (key === "d" || key === " ") {
        this.toggle();
      } else if ("0" <= key && key <= "9") {
        this.toggle(parseInt(key, 10));
      } else if (key === "r") {
        this.remove();
      } else if (key === "a") {
        const title = await prompt("Add task: ");

        if (title) {
          await this.add(title);
        }
      } else if (key === "e") {
        if (!this.tasks[this.currentIndex]) {
          return;
        }

        const title = await prompt(
          "Edit task (" + this.tasks[this.currentIndex].title + "): ",
        );

        if (title) {
          this.edit(this.currentIndex, title);
        }
      } else if (key == "\u0003") { // ctrl-c
        Deno.exit();
      }
    }
  }
}
