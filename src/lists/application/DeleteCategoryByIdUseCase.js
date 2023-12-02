import { BaseUseCase } from "../../shared/domain/BaseUseCase";
import { CategoriesRepository } from "../infrastructure/repositories";

export class DeleteCategoryByIdUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new CategoriesRepository();

    return new DeleteCategoryByIdUseCase({ repository });
  }

  async execute(categoryId) {
    return await this._repository.deleteById(categoryId);
  }
}
