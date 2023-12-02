import { CreateCategoryUseCase } from ".";
import { Category } from "../domain";

describe("CreateCategoryUseCase", () => {
  describe("#execute", () => {
    it("creates a category", async () => {
      const fakeCategoriesRepository = {
        create: jest.fn(),
      };

      fakeCategoriesRepository.create.mockResolvedValue({
        id: 15,
      });

      const useCase = new CreateCategoryUseCase({
        categoriesRepository: fakeCategoriesRepository,
      });

      const list = {
        id: -1,
        name: "category",
        description: "desc",
      };

      const result = await useCase.execute(list);

      expect(fakeCategoriesRepository.create.mock.calls[0][0]).toStrictEqual(list);
      expect(result).toStrictEqual({ id: 15 });
    });
  });
});
