export class User {
  constructor({ id, name, isAdmin }) {
    this.id = id;
    this.name = name;
    this.isAdmin = isAdmin;
    this.password = "";
    this.confirmPassword = "";
  }

  static createEmpty() {
    return new User({ name: "", isAdmin: false });
  }
}
