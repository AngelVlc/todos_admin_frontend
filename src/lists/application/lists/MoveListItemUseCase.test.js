import { MoveListItemUseCase } from "./";

describe("MoveListItemUseCase", () => {
  describe("#execute", () => {
    it("moves a list item", async () => {
      const repository = {
        moveListItem: jest.fn(),
      };

      repository.moveListItem.mockResolvedValue(true);

      const useCase = new MoveListItemUseCase({ repository });
      const result = await useCase.execute(55, 20, 10);

      expect(result).toBe(true);
      expect(repository.moveListItem.mock.calls[0][0]).toBe(55, 20, 10);
    });
  });
});
