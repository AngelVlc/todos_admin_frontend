import { UpdateListItemUseCase } from "./";

describe("UpdateListItemUseCase.#execute", () => {
  it("updates a list item", async () => {
    const repository = {
      update: jest.fn(),
    };

    repository.update.mockResolvedValue({ id: 44 });

    const useCase = new UpdateListItemUseCase({ repository });
    const result = await useCase.execute({ id: 1 });

    expect(result).toStrictEqual({ id: 44 });
    expect(repository.update.mock.calls[0][0]).toStrictEqual({ id: 1 });
  });
});
