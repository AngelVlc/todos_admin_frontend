import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { User } from "../../domain";
import { UsersRepository } from "../../infrastructure/repositories";

export class GetUserByIdUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new UsersRepository();

    return new GetUserByIdUseCase({ repository });
  }

  async execute(id) {
    const result = await this._repository.getById(id);

    return new User(result);
  }
}
