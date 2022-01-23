import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { ListsRepository } from "../../infrastructure/repositories";

export class CreateListUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListsRepository();

    return new CreateListUseCase({ repository });
  }

  async execute(list) {
    return await this._repository.create(list);
  }
}
