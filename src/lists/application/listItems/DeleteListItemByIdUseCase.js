import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { ListItemsRepository } from "../../infrastructure/repositories";

export class DeleteListItemByIdUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListItemsRepository();

    return new DeleteListItemByIdUseCase({ repository });
  }

  async execute(listId, itemId) {
    return await this._repository.deleteById(listId, itemId);
  }
}
