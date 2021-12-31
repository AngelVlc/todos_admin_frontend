export class RefreshToken {
  constructor({id, userId, expirationDate}) {
    this._id = id;
    this._userId = userId;
    this._expirationDate = expirationDate;
    this._selected = false;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get expirationDate() {
    return this._expirationDate;
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    this._selected = value;
  } 
}