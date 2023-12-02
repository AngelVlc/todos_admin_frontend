import { Category } from "../domain";
import { UpdateCategoryUseCase } from ".";

describe("UpdateCategoryUseCase", () => {
  describe("#execute", () => {
    it("updates a category", async () => {
      const fakeCategoriesRepository = {
        update: jest.fn(),
      };

      fakeCategoriesRepository.update.mockResolvedValue({ id: 44 });

      const categoryToUpdate = new Category({
        id: 1,
        name: "updated name",
      });

      const useCase = new UpdateCategoryUseCase({
        categoriesRepository: fakeCategoriesRepository,
      });
      const result = await useCase.execute(categoryToUpdate);

      expect(fakeCategoriesRepository.update.mock.calls[0][0]).toStrictEqual(
        categoryToUpdate
      );
      expect(result).toStrictEqual({ id: 44 });
    });
  });
});
