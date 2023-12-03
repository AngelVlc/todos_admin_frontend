import { BaseUseCase } from "../../shared/domain/BaseUseCase";
import { Category } from "../domain";
import { CategoriesRepository } from "../infrastructure/repositories";

export class GetCategoriesUseCase extends BaseUseCase {
  _repository;

  constructor({ repository }) {
    super();

    this._repository = repository;
  }

  static create() {
    const repository = new CategoriesRepository();

    return new GetCategoriesUseCase({ repository });
  }

  async execute() {
    const result = await this._repository.getAll();

    return result.map((item) => {
      return new Category(item);
    });
  }
}
