export class List {
  constructor({ id, name, items, itemsCount, isQuickList }) {
    this.id = id;
    this.name = name;
    this.itemsCount = itemsCount;
    this.items = items;
    this.isQuickList =  isQuickList;
  }
}
