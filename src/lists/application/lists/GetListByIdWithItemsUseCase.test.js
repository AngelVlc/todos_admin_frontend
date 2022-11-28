import { List } from "../../domain";
import { GetListByIdWithItemsUseCase } from "./";

describe("GetListByIdWithItemsUseCase", () => {
  describe("#execute", () => {
    it("gets a list", async () => {
      const listsRepository = {
        getById: jest.fn(),
      };

      const listItemsRepository = {
        getAllByListId: jest.fn(),
      };

      listsRepository.getById.mockResolvedValue({
        id: 1,
        name: "name",
        itemsCount: 2,
      });

      listItemsRepository.getAllByListId.mockResolvedValue([
        {
          id: 1,
          title: "title1",
          description: "desc1",
          listId: 1,
        },
        {
          id: 2,
          title: "title2",
          description: "desc2",
          listId: 1,
        },
      ]);

      const useCase = new GetListByIdWithItemsUseCase({
        listsRepository,
        listItemsRepository,
      });
      const result = await useCase.execute(1);

      const expected_result = new List({
        id: 1,
        name: "name",
        itemsCount: 2,
        items: [
          {
            id: 1,
            title: "title1",
            description: "desc1",
            listId: 1,
          },
          {
            id: 2,
            title: "title2",
            description: "desc2",
            listId: 1,
          },
        ],
      });

      expect(listsRepository.getById.mock.calls[0][0]).toBe(1);
      expect(listItemsRepository.getAllByListId.mock.calls[0][0]).toBe(1);
      expect(result).toStrictEqual(expected_result);
    });
  });
});
