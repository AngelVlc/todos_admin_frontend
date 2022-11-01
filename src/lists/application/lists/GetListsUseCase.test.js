import { List } from "../../domain";
import { GetListsUseCase } from ".";

describe("GetListsUseCase.#execute", () => {
  it("gets the lists", async () => {
    const repository = {
      getAll: jest.fn(),
    };

    repository.getAll.mockResolvedValue([
      {
        id: 1,
        name: "list1",
        itemsCount: 2,
        isQuickList: true,
      },
      {
        id: 2,
        name: "list2",
        itemsCount: 5,
        isQuickList: false,
      },
    ]);

    const useCase = new GetListsUseCase({ repository });
    const result = await useCase.execute();

    expect(repository.getAll.mock.calls.length).toBe(1);
    expect(result).toStrictEqual([
      new List({
        id: 1,
        name: "list1",
        itemsCount: 2,
        isQuickList: true,
      }),
      new List({
        id: 2,
        name: "list2",
        itemsCount: 5,
        isQuickList: false,
      }),
    ]);
  });
});
