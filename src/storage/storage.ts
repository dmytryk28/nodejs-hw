import {readFileSync, writeFileSync} from 'node:fs';

export class Storage<T extends { id: string }> {
  private readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  private read(): T[] {
    try {
      const data = readFileSync(this.path, 'utf-8');
      return JSON.parse(data) as T[];
    } catch (_) {
      return [];
    }
  }

  private write(items: T[]): void {
    writeFileSync(this.path, JSON.stringify(items));
  }

  public getById(id: string): T | undefined {
    return this.read().find(item => item.id === id);
  }

  public getAll(): T[] {
    return this.read();
  }

  public save(item: T): void {
    const items = this.read();
    const existingIndex = items.findIndex(existingItem => existingItem.id === item.id);
    if (existingIndex !== -1) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }
    this.write(items);
  }

  public delete(id: string): boolean {
    const items = this.read();
    const filteredItems = items.filter(item => item.id !== id);
    const isDeleted = items.length === filteredItems.length + 1;
    if (isDeleted) {
      this.write(filteredItems);
    }
    return isDeleted;
  }
}