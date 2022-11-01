export class List {
  constructor({ id, name, itemsCount, isQuickList }) {
    this.id = id;
    this.name = name;
    this.items = [];
    this.itemsCount = itemsCount;
    this.isQuickList = isQuickList;
  }

  static createEmpty() {
    return new List({ name: "", itemsCount: 0, isQuickList: false });
  }
}
