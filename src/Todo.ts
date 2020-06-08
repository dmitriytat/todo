import {Task} from './Task.ts';
import {print, printInteractive} from './utils/print.ts';
import {leftPad} from "./utils/leftPad.ts";
import {bold, green, red, yellow} from "../dep.ts";
import {toolbar} from "../ui.ts";

export class Todo {
    private tasks: Task[] = [];
    private currentIndex: number = 0;

    constructor(private file: string = 'tasks.json') {
        this.read();
    }

    getCurrent() {
        return this.tasks[this.currentIndex];
    }

    read() {
        let tasks = [];
        try {
            const data = Deno.readTextFileSync(this.file);
            tasks = JSON.parse(data);
        } catch (e) {
        } finally {
            this.tasks = tasks;
        }
    }

    write() {
        const data = JSON.stringify(this.tasks);
        Deno.writeTextFileSync(this.file, data);
    }

    up() {
        this.currentIndex = this.currentIndex ? this.currentIndex - 1 : this.tasks.length - 1;
    }

    down() {
        this.currentIndex = this.currentIndex === this.tasks.length - 1 ? 0 : this.currentIndex + 1;
    }

    async add(title: string): Promise<void> {
        this.tasks.push({ title, isDone: false });

        this.write();
    }

    async list(interactive = false) {
        const doCount = this.tasks.filter(task => !task.isDone).length;

        const title = `${bold('TODO:')} ${doCount}`;

        const list = this.tasks.map((task, index) => {
            const isActive = this.currentIndex === index;
            const number = yellow(leftPad(index.toString(), 2, '0'));
            const checkbox = task.isDone ? green('[*]') : red('[ ]');
            const title = isActive ? bold(task.title) : task.title;

            return `${number} ${checkbox} ${title}`
        });

        const lines = [
            title,
            ...list,
            toolbar,
        ].join('\n');

        if (interactive) {
            await printInteractive(lines);
        } else {
            await print(lines);
        }
    }

    toggle() {
        const task = this.tasks[this.currentIndex];

        if (task) {
            task.isDone = !task.isDone;
            this.write();
        }
    }

    done(index: number = this.currentIndex): void {
        const task = this.tasks[index];

        if (task) {
            task.isDone = true;
            this.write();
        }
    }

    undone(index: number = this.currentIndex): void {
        const task = this.tasks[index];

        if (task) {
            task.isDone = false;
            this.write();
        }
    }

    remove(index: number = this.currentIndex): void {
        this.tasks = [
            ...this.tasks.slice(0, index - 1),
            ...this.tasks.slice(index),
        ];

        this.write();
    }
}
