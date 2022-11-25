export class ListItem {
  constructor({ id, title, description, listId, position, state }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.listId = listId;
    this.position = position;
    this.state = state;
  }

  static createEmpty(listId) {
    return new ListItem({ id: -1, listId: listId, title: "", description: "" });
  }
}
