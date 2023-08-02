import { List, ListItem } from "../../domain";
import { UpdateListUseCase } from "./";

describe("UpdateListUseCase", () => {
  describe("#execute", () => {
    it("updates a list and its items", async () => {
      const fakeListsRepository = {
        update: jest.fn(),
      };

      fakeListsRepository.update.mockResolvedValue({ id: 44 });

      const listToUpdate = new List({
        id: 1,
        name: "updated name",
        items: [
          new ListItem({ id: -1, title: "added item", listId: 1 }),
          new ListItem({
            id: -2,
            title: "another added item",
            listId: 1,
          }),
          new ListItem({
            id: 11,
            title: "not updated existing item",
            listId: 1,
          }),
          new ListItem({
            id: 22,
            title: "updated existing item",
            listId: 1,
          }),
        ],
      });

      const useCase = new UpdateListUseCase({
        listsRepository: fakeListsRepository,
      });
      const result = await useCase.execute(listToUpdate);

      expect(fakeListsRepository.update.mock.calls[0][0]).toStrictEqual(
        listToUpdate
      );
      expect(result).toStrictEqual({ id: 44 });
    });
  });
});
