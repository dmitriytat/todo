import {
    green,
    red,
    yellow,
    white,
    bold,
} from "https://deno.land/std@0.53.0/fmt/colors.ts";

import { Collection } from './Collection.ts';
import { Task } from './models/Task.ts';
import {print, printInteractive} from './print.ts';
import {leftpad} from "./leftpad.ts";

export class App {
    private collection: Collection<Task>;
    private activeIndex: number = 0;

    constructor() {
        this.collection = new Collection<Task>('./tasks.json');
    }

    add(title: string): void {
        const task = new Task(title);

        this.collection.add(task);
        this.collection.save();
    }

    toggleCurrent() {
        const task = this.collection.getAll()[this.activeIndex];

        task.isDone = !task.isDone;
        this.collection.save();
    }

    done(id: number): void {
        const task = this.collection.getById(id);

        if (!task) {
            return;
        }

        task.isDone = true;
        this.collection.save();
    }

    undone(id: number): void {
        const task = this.collection.getById(id);

        if (!task) {
            return;
        }

        task.isDone = false;
        this.collection.save();
    }

    remove(id: number): void {
        this.collection.removeById(id);
        this.collection.save();
    }

    up() {
        this.activeIndex = this.activeIndex ? this.activeIndex - 1 : this.collection.count - 1;
    }

    down() {
        this.activeIndex = (this.activeIndex + 1) % this.collection.count;
    }

    async list(interactive = false) {
        const tasks = this.collection.getAll();

        const title = `${bold('TODO:')}`;

        const list = tasks.map((task, index) => {
            const isActive = this.activeIndex === index;
            const number = yellow(leftpad(index.toString(), 2, '0'));
            const checkbox = task.isDone ? green('[*]') : red('[ ]');
            const title = isActive ? bold(task.title) : task.title;

            return `${number} ${checkbox} ${title}`
        });

        const lines = [
            title,
            ...list,
        ].join('\n');

        if (interactive) {
            await printInteractive(lines);
        } else {
            await print(lines);
        }
    }
}
