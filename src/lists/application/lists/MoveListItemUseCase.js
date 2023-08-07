import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { ListsRepository } from "../../infrastructure/repositories";

export class MoveListItemUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListsRepository();

    return new MoveListItemUseCase({ repository });
  }

  async execute(originListId, itemId, destinationListId) {
    return await this._repository.moveListItem(originListId, itemId, destinationListId);
  }
}
