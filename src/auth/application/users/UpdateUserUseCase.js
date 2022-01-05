import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { UsersRepository } from "../../infrastructure/repositories";

export class UpdateUserUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new UsersRepository();

    return new UpdateUserUseCase({ repository });
  }

  async execute(user) {
    return await this._repository.update(user);
  }
}
