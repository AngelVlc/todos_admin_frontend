import { CreateListUseCase } from "./";
import { List, ListItem } from "../../domain";

describe("CreateListUseCase", () => {
  describe("#execute", () => {
    it("creates a list with its items", async () => {
      const fakeListsRepository = {
        create: () => {
          return { id: 15, name: "name" };
        },
      };

      const fakeListItemsRepository = {
        create: () => {
          return {
            id: 30,
            title: "title",
            listId: 15,
          };
        },
      };

      const useCase = new CreateListUseCase({
        listsRepository: fakeListsRepository,
        listItemsRepository: fakeListItemsRepository,
      });

      const result = await useCase.execute({
        name: "list",
        items: [{ title: "title" }],
      });

      const expextedResult = new List({
        id: 15,
        name: "name",
        items: [new ListItem({ id: 30, title: "title", listId: 15 })],
      });

      expect(result).toStrictEqual(expextedResult);
    });
  });
});
