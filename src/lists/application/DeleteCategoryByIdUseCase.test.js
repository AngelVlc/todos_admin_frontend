import { DeleteCategoryByIdUseCase } from ".";

describe("DeleteCategoryByIdUseCase", () => {
  describe("#execute", () => {
    it("deletes a category", async () => {
      const repository = {
        deleteById: jest.fn(),
      };

      repository.deleteById.mockResolvedValue(true);

      const useCase = new DeleteCategoryByIdUseCase({ repository });
      const result = await useCase.execute(55);

      expect(result).toBe(true);
      expect(repository.deleteById.mock.calls[0][0]).toBe(55);
    });
  });
});
