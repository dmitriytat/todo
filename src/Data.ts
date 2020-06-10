export class Data<T> {
  private items: T[] = [];

  constructor(private file: string) {
    this.open();
  }

  open() {
    let items = [];
    try {
      const data = Deno.readTextFileSync(this.file);
      items = JSON.parse(data);
    } catch (e) {
    } finally {
      this.items = items;
    }
  }

  save() {
    const data = JSON.stringify(this.items);
    Deno.writeTextFileSync(this.file, data);
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
