export class User {
  constructor({ id, name, isAdmin }) {
    this._id = id;
    this._name = name;
    this._isAdmin = isAdmin;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get isAdmin() {
    return this._isAdmin;
  }
}
