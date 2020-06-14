import { Task } from "./Task.ts";
import { formatTaskList } from "./utils/ui.ts";
import { Data } from "./Data.ts";
import { Terminal } from "./Terminal.ts";

export class Todo {
    private currentIndex: number = 0;

    constructor(private data: Data<Task>, private terminal: Terminal) {}

    get current() {
        return this.data.get(this.currentIndex);
    }

    up() {
        this.currentIndex = this.currentIndex === 0
            ? this.data.count() - 1
            : this.currentIndex - 1;
    }

    down() {
        this.currentIndex = this.currentIndex === this.data.count() - 1
            ? 0
            : this.currentIndex + 1;
    }

    async list(interactive: boolean = false) {
        const tasks = this.data.getAll();
        const list = formatTaskList(tasks, interactive, this.currentIndex);

        if (interactive) {
            await this.terminal.printInteractive(list);
        } else {
            await this.terminal.printLines(list);
        }
    }

    toggle(index: number = this.currentIndex) {
        const task = this.data.get(index);

        if (task) {
            task.isDone = !task.isDone;
            this.data.save();
        }
    }


    done(index: number = this.currentIndex): void {
        const task = this.data.get(index);

        if (task) {
            task.isDone = true;
            this.data.save();
        }
    }

    undone(index: number = this.currentIndex): void {
        const task = this.data.get(index);

        if (task) {
            task.isDone = false;
            this.data.save();
        }
    }

    add(title: string) {
        if (!title) {
            return;
        }

        this.data.add({
            title,
            isDone: false,
        });
    }

    edit(index: number, title: string) {
        const task = this.data.get(index);

        if (task) {
            task.title = title;
            this.data.save();
        }
    }

    remove(index: number = this.currentIndex) {
        if (index === this.data.count() - 1) {
            this.up();
        }

        this.data.remove(index);
    }

    async interactive() {
        while (true) {
            await this.list(true);

            const key = await this.terminal.readKeypress();

            if (key === "\u001B\u005B\u0041" || key === "\u001B\u005B\u0044") { // вверх или влево
                this.up();
            } else if (key === "\u001B\u005B\u0042" || key === "\u001B\u005B\u0043") { // вниз или вправо
                this.down();
            } else if (key === "d" || key === " ") {
                this.toggle();
            } else if ('0' <= key && key <= '9') {
                this.toggle(parseInt(key, 10));
            } else if (key === "r") {
                this.remove();
            } else if (key === "a") {
                const title = await this.terminal.prompt("Add task: ");

                if (title) {
                    await this.add(title);
                }
            } else if (key === "e") {
                if (!this.current) {
                    return;
                }

                const title = await this.terminal.prompt("Edit task (" + this.current.title + "): ");

                if (title) {
                    this.edit(this.currentIndex, title);
                }
            } else if (key == "\u0003") { // ctrl-c
                Deno.exit();
            }
        }
    }
}
