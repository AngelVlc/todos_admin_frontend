import { Category } from "../domain";
import { GetCategoriesUseCase } from ".";

describe("GetCategoriesUseCase", () => {
  describe("#execute", () => {
    it("gets the lists", async () => {
      const repository = {
        getAll: jest.fn(),
      };

      repository.getAll.mockResolvedValue([
        {
          id: 1,
          name: "category1",
        },
        {
          id: 2,
          name: "category2",
        },
      ]);

      const useCase = new GetCategoriesUseCase({ repository });
      const result = await useCase.execute();

      expect(repository.getAll).toHaveBeenCalled();
      expect(result).toStrictEqual([
        new Category({
          id: 1,
          name: "category1",
        }),
        new Category({
          id: 2,
          name: "category2",
        }),
      ]);
    });
  });
});
