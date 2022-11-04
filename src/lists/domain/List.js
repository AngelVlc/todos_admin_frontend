export class List {
  constructor({ id, name, itemsCount }) {
    this.id = id;
    this.name = name;
    this.items = [];
    this.itemsCount = itemsCount;
  }

  static createEmpty() {
    return new List({ name: "", itemsCount: 0 });
  }
}
