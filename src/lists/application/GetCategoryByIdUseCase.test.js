import { Category } from "../domain";
import { GetCategoryByIdUseCase } from ".";

describe("GetCategoryByIdUseCase", () => {
  describe("#execute", () => {
    it("gets a category", async () => {
      const repository = {
        getById: jest.fn(),
      };

      repository.getById.mockResolvedValue({
        id: 1,
        name: "category",
        description: "desc",
      });

      const useCase = new GetCategoryByIdUseCase({ repository });
      const result = await useCase.execute(1);

      expect(repository.getById.mock.calls[0][0]).toBe(1);
      expect(result).toStrictEqual(
        new Category({
          id: 1,
          name: "category",
          description: "desc",
        })
      );
    });
  });
});
