import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { UsersRepository } from "../../infrastructure/repositories";

export class DeleteUserByIdUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new UsersRepository();

    return new DeleteUserByIdUseCase({ repository });
  }

  async execute(id) {
    return await this._repository.deleteById(id);
  }
}
