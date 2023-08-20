import { BaseUseCase } from "../../shared/domain/BaseUseCase";
import { List } from "../domain";
import { ListsRepository } from "../infrastructure/repositories";

export class GetListsUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListsRepository();

    return new GetListsUseCase({ repository });
  }

  async execute() {
    const result = await this._repository.getAll();

    return result.map((item) => {
      return new List(item);
    });
  }
}
