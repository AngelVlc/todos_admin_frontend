import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { RefreshTokensRepository } from "../../infrastructure/repositories";

export class DeleteSelectedRefreshTokensUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new RefreshTokensRepository();
    return new DeleteSelectedRefreshTokensUseCase({repository});
  }

  async execute(refreshTokens) {
    const selectedIDs = refreshTokens.reduce((filtered, rt) => {
      if (rt.selected) {
        filtered.push(rt.id);
      }

      return filtered;
    }, []);

    return await this._repository.deleteByIds(selectedIDs);
  }
}
