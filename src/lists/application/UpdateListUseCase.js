import { BaseUseCase } from "../../shared/domain/BaseUseCase";
import { ListsRepository } from "../infrastructure/repositories";

export class UpdateListUseCase extends BaseUseCase {
  _listsRepository;

  constructor({ listsRepository }) {
    super();

    this._listsRepository = listsRepository;
  }

  static create() {
    const listsRepository = new ListsRepository();

    return new UpdateListUseCase({ listsRepository });
  }

  async execute(list) {
    return await this._listsRepository.update(list);
  }
}
