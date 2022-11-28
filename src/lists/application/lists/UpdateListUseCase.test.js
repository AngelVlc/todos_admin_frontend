import { List, ListItem } from "../../domain";
import { UpdateListUseCase } from "./";

describe("UpdateListUseCase", () => {
  describe("#execute", () => {
    it("updates a list and its items", async () => {
      const fakeListRepository = {
        update: jest.fn(),
      };

      const fakeListItemsRepository = {
        create: jest.fn(),
        update: jest.fn(),
        deleteById: jest.fn(),
      };

      fakeListItemsRepository.create.mockResolvedValueOnce({ id: 44 });
      fakeListItemsRepository.create.mockResolvedValueOnce({ id: 45 });

      fakeListRepository.update.mockResolvedValue({ id: 44 });

      const listToUpdate = new List({
        id: 1,
        name: "updated name",
        items: [
          new ListItem({ id: -1, title: "added item", listId: 1 }),
          new ListItem({
            id: -2,
            title: "another added item",
            state: "modified",
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
            state: "modified",
            listId: 1,
          }),
          new ListItem({
            id: 33,
            title: "deleted item",
            state: "deleted",
            listId: 1,
          }),
        ],
      });

      const useCase = new UpdateListUseCase({
        listsRepository: fakeListRepository,
        listItemsRepository: fakeListItemsRepository,
      });
      const result = await useCase.execute(listToUpdate);

      expect(fakeListItemsRepository.deleteById.mock.calls[0][0]).toBe(1);
      expect(fakeListItemsRepository.deleteById.mock.calls[0][1]).toBe(33);
      expect(fakeListItemsRepository.update.mock.calls[0][0].listId).toBe(1);
      expect(fakeListItemsRepository.update.mock.calls[0][0].id).toBe(22);
      expect(fakeListItemsRepository.update.mock.calls[0][0].title).toBe(
        "updated existing item"
      );
      expect(fakeListItemsRepository.create.mock.calls[0][0].title).toBe(
        "added item"
      );
      expect(fakeListItemsRepository.create.mock.calls[1][0].title).toBe(
        "another added item"
      );

      expect(fakeListRepository.update.mock.calls[0][0].id).toBe(1);
      expect(
        fakeListRepository.update.mock.calls[0][0].idsByPosition
      ).toStrictEqual([44, 45, 11, 22]);
    });
  });
});
