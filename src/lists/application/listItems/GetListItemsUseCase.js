import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { ListItem } from "../../domain";
import { ListItemsRepository } from "../../infrastructure/repositories";

export class GetListItemsUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListItemsRepository();

    return new GetListItemsUseCase({ repository });
  }

  async execute(listId) {
    const result = await this._repository.getAll(listId);

    return result.map((item) => {
      return new ListItem(item);
    });
  }
}
