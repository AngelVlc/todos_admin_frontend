export class RefreshToken {
  constructor({id, userId, expirationDate}) {
    this.id = id;
    this.userId = userId;
    this.expirationDate = expirationDate;
    this.selected = false;
  }
}