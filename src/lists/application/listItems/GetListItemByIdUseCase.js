import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { ListItem } from "../../domain";
import { ListItemsRepository } from "../../infrastructure/repositories";

export class GetListItemByIdUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListItemsRepository();

    return new GetListItemByIdUseCase({ repository });
  }

  async execute(listId, itemId) {
    const result = await this._repository.getById(listId, itemId);

    return new ListItem(result);
  }
}
