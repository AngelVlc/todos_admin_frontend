import { IndexAllListsUseCase } from "./";

describe("IndexAllListsUseCase", () => {
  describe("#execute", () => {
    it("index all the lists", async () => {
      const repository = {
        indexAllLists: jest.fn(),
      };

      repository.indexAllLists.mockResolvedValue(true);

      const useCase = new IndexAllListsUseCase({ repository });
      const result = await useCase.execute();

      expect(result).toBe(true);
      expect(repository.indexAllLists.mock.calls[0][0]).toBe(undefined);
    });
  });
});
