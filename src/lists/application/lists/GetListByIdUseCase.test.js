import { List } from "../../domain";
import { GetListByIdUseCase } from "./";

describe("GetListByIdUseCase.#execute", () => {
  it("gets a list", async () => {
    const repository = {
      getById: () => {
        return {
          id: 1,
          name: "name",
          itemsCount: 2,
        };
      },
    };

    const useCase = new GetListByIdUseCase({ repository });
    const result = await useCase.execute();

    expect(result).toStrictEqual(
      new List({
        id: 1,
        name: "name",
        itemsCount: 2,
      })
    );
  });
});
