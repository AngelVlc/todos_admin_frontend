export class User {
  constructor({ id, name, isAdmin }) {
    this.id = id;
    this.name = name;
    this.isAdmin = isAdmin;
    this.password = "";
    this.confirmPassword = "";
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      isAdmin: this.isAdmin,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };
  }
}
