import { ListItem } from "../../domain";
import { GetListItemsUseCase } from ".";

describe("GetListItemsUseCase.#execute", () => {
  it("gets the list items", async () => {
    const repository = {
      getAll: jest.fn(),
    };

    repository.getAll.mockResolvedValue([
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

    const useCase = new GetListItemsUseCase({ repository });
    const result = await useCase.execute(1);

    expect(repository.getAll.mock.calls[0][0]).toBe(1);
    expect(result).toStrictEqual([
      new ListItem({
        id: 1,
        title: "title1",
        description: "desc1",
        listId: 1,
      }),
      new ListItem({
        id: 2,
        title: "title2",
        description: "desc2",
        listId: 1,
      }),
    ]);
  });
});
