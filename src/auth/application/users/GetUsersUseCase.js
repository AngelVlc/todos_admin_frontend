import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { User } from "../../domain";
import { UsersRepository } from "../../infrastructure/repositories";

export class GetUsersUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new UsersRepository();

    return new GetUsersUseCase({ repository });
  }

  async execute() {
    const result = await this._repository.getAll();

    return result.map((item) => {
      return new User(item);
    });
  }
}
