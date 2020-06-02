export interface Item {
    id: number;
}

export class Collection<T extends Item> {
    private items: T[] = [];

    constructor(private readonly file: string) {
        this.open();
    }

    open() {
        try {
            const data = Deno.readTextFileSync(this.file);
            this.items = JSON.parse(data);
        } catch (e) {}
    }

    save() {
        const data = JSON.stringify(this.items);
        Deno.writeTextFileSync(this.file, data);
    }

    get count() {
        return this.items.length;
    }

    genId() {
        let lastId = -1;

        if (this.count) {
            lastId = this.items[this.count - 1].id;
        }

        return lastId + 1;
    }

    add(item: T) {
        item.id = this.genId();
        this.items.push(item);
    }

    getById(id: T['id']): T | undefined {
        return this.items.find((item : T) => item.id === id);
    }

    getAll(): T[] {
        return this.items;
    }

    removeById(id: T['id']): void {
        this.items = this.items.filter((item : T) => item.id !== id);
    }
}
