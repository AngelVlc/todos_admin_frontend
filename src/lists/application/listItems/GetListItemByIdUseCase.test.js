import { ListItem } from "../../domain";
import { GetListItemByIdUseCase } from "./";

describe("GetListItemByIdUseCase.#execute", () => {
  it("gets a list", async () => {
    const repository = {
      getById: jest.fn(),
    };

    repository.getById.mockResolvedValue({
      id: 1,
      title: "title",
      description: "desc",
      listId: 2,
    });

    const useCase = new GetListItemByIdUseCase({ repository });
    const result = await useCase.execute(2, 1);

    expect(repository.getById.mock.calls[0][0]).toBe(2);
    expect(repository.getById.mock.calls[0][1]).toBe(1);
    expect(result).toStrictEqual(
      new ListItem({
        id: 1,
        title: "title",
        description: "desc",
        listId: 2,
      })
    );
  });
});
