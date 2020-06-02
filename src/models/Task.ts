import { Item } from '../Collection.ts';

export class Task implements Item {
    id!: number;
    title: string = '';
    isDone: boolean = false;

    constructor(title: string) {
        this.title = title;
    }
}
