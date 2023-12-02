export class Category {
  constructor({ id, name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static createEmpty() {
    return new Category({ id: -1, name: "", description: "" });
  }
}
