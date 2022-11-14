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

  addNewItem(newItem) {
    newItem.position = this.items.length;
    newItem.id = -1;

    this.items.forEach((item) => {
      if (item.id <= newItem.id) {
        newItem.id = item.id - 1;
      }
    });

    this.items.push(newItem);
  }
}
