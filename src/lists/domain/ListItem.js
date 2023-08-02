export class ListItem {
  constructor({ id, title, description, listId }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.listId = listId;
  }

  static createEmpty(listId) {
    return new ListItem({ id: -1, listId: listId, title: "", description: "" });
  }
}
