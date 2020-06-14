import { ensureFileSync, readJsonSync, writeJsonSync } from "../dep.ts";

export class Data<T> {
  private items: T[] = [];

  constructor(private file: string) {
    this.open();
  }

  open() {
    let items: T[] = [];
    try {
      ensureFileSync(this.file);
      items = readJsonSync(this.file) as T[];
    } catch (e) {
    } finally {
      this.items = items;
    }
  }

  save() {
    writeJsonSync(this.file, this.items, { spaces: 2 });
  }

  count() {
    return this.items.length;
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return this.items;
  }

  add(item: T) {
    this.items.push(item);

    this.save();
  }

  remove(index: number): void {
    this.items.splice(index, 1);

    this.save();
  }
}
