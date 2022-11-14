export class ListItem {
  constructor({ id, title, description, listId, position }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.listId = listId;
    this.position = position;
  }

  static createEmpty(listId) {
    return new ListItem({ listId: listId, title: "", description: "" });
  }
}
