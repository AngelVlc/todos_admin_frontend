import { BaseUseCase } from "../../shared/domain/BaseUseCase";
import { CategoriesRepository } from "../infrastructure/repositories";

export class CreateCategoryUseCase extends BaseUseCase {
  _categoriesRepository;

  constructor({ categoriesRepository }) {
    super();

    this._categoriesRepository = categoriesRepository;
  }

  static create() {
    const categoriesRepository = new CategoriesRepository();

    return new CreateCategoryUseCase({ categoriesRepository });
  }

  async execute(category) {
   return await this._categoriesRepository.create(category);
  }
}
