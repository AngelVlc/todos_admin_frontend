import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { ListsRepository } from "../../infrastructure/repositories";

export class DeleteListByIdUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListsRepository();

    return new DeleteListByIdUseCase({ repository });
  }

  async execute(listId, itemId) {
    return await this._repository.deleteById(listId, itemId);
  }
}
