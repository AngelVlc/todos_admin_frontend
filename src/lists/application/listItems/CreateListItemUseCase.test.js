import { CreateListItemUseCase } from "./";

describe("CreateListItemUseCase.#execute", () => {
  it("creates a list item", async () => {
    const repository = {
      create: jest.fn(),
    };

    repository.create.mockResolvedValue({ id: 55 });

    const useCase = new CreateListItemUseCase({ repository });
    const result = await useCase.execute({ title: "list" });

    expect(result).toStrictEqual({ id: 55 });
    expect(repository.create.mock.calls[0][0]).toStrictEqual({ title: "list" });
  });
});
