import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { RefreshToken } from "../../domain";
import { RefreshTokensRepository } from "../../infrastructure/repositories";

export class GetRefreshTokensUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new RefreshTokensRepository();

    return new GetRefreshTokensUseCase({ repository });
  }

  async execute() {
    const result = await this._repository.getAll();

    return result.map((item) => {
      return new RefreshToken(item);
    });
  }
}
