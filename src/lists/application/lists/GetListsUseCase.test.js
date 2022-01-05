import { List } from "../../domain";
import { GetListsUseCase } from ".";

describe("GetListsUseCase.#execute", () => {
  it("gets the lists", async () => {
    const repository = {
      getAll: () => {
        return [
          {
            id: 1,
            name: "user1",
            itemsCount: 2,
          },
          {
            id: 2,
            name: "user2",
            itemsCount: 5,
          },
        ];
      },
    };

    const useCase = new GetListsUseCase({ repository });
    const result = await useCase.execute();

    expect(result).toStrictEqual([
      new List({
        id: 1,
        name: "user1",
        itemsCount: 2,
      }),
      new List({
        id: 2,
        name: "user2",
        itemsCount: 5,
      }),
    ]);
  });
});
