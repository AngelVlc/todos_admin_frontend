import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { ListsRepository } from "../../infrastructure/repositories";

export class UpdateListUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListsRepository();

    return new UpdateListUseCase({ repository });
  }

  async execute(list) {
    const ids = list.items.map(item => item.id);
    const body = {...list, idsByPosition: ids};

    return await this._repository.update(body);
  }
}
