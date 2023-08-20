import { BaseUseCase } from "../../shared/domain/BaseUseCase";
import { List } from "../domain";
import { ListsRepository } from "../infrastructure/repositories";

export class GetListByIdUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListsRepository();

    return new GetListByIdUseCase({ repository });
  }

  async execute(id) {
    const result = await this._repository.getById(id);

    return new List(result);
  }
}
