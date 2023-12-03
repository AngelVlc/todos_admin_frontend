import { BaseUseCase } from "../../shared/domain/BaseUseCase";
import { Category } from "../domain";
import { CategoriesRepository } from "../infrastructure/repositories";

export class GetCategoryByIdUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new CategoriesRepository();

    return new GetCategoryByIdUseCase({ repository });
  }

  async execute(id) {
    const result = await this._repository.getById(id);

    return new Category(result);
  }
}
