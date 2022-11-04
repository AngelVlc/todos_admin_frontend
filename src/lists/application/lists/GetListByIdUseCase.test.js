import { List } from "../../domain";
import { GetListByIdUseCase } from "./";

describe("GetListByIdUseCase.#execute", () => {
  it("gets a list", async () => {
    const repository = {
      getById: jest.fn(),
    };

    repository.getById.mockResolvedValue({
      id: 1,
      name: "name",
      itemsCount: 2,
    });

    const useCase = new GetListByIdUseCase({ repository });
    const result = await useCase.execute(1);

    expect(repository.getById.mock.calls[0][0]).toBe(1);
    expect(result).toStrictEqual(
      new List({
        id: 1,
        name: "name",
        itemsCount: 2,
      })
    );
  });
});
