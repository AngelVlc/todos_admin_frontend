import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { ListsRepository } from "../../infrastructure/repositories";

export class GetSearchSecureKeyUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new ListsRepository();

    return new GetSearchSecureKeyUseCase({ repository });
  }

  async execute() {
    return await this._repository.getSearchSecureKey();
  }
}
