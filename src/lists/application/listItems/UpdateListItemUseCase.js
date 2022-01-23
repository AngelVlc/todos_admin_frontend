import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { ListItemsRepository } from "../../infrastructure/repositories";

export class UpdateListItemUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListItemsRepository();

    return new UpdateListItemUseCase({ repository });
  }

  async execute(listItem) {
    return await this._repository.update(listItem);
  }
}
