import { GetSearchSecureKeyUseCase } from "./";

describe("GetSearchSecureKeyUseCase", () => {
  describe("#execute", () => {
    it("gets a list", async () => {
      const repository = {
        getSearchSecureKey: jest.fn(),
      };

      repository.getSearchSecureKey.mockResolvedValue("search_key");

      const useCase = new GetSearchSecureKeyUseCase({ repository });
      const result = await useCase.execute();

      expect(result).toStrictEqual("search_key");
    });
  });
});
