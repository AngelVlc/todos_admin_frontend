import { List } from "../domain";
import { GetListsUseCase } from ".";

describe("GetListsUseCase", () => {
  describe("#execute", () => {
    it("gets the lists", async () => {
      const repository = {
        getAll: jest.fn(),
      };

      repository.getAll.mockResolvedValue([
        {
          id: 1,
          name: "list1",
          itemsCount: 2,
        },
        {
          id: 2,
          name: "list2",
          itemsCount: 5,
        },
      ]);

      const useCase = new GetListsUseCase({ repository });
      const result = await useCase.execute();

      expect(repository.getAll).toHaveBeenCalled();
      expect(result).toStrictEqual([
        new List({
          id: 1,
          name: "list1",
          itemsCount: 2,
        }),
        new List({
          id: 2,
          name: "list2",
          itemsCount: 5,
        }),
      ]);
    });
  });
});
