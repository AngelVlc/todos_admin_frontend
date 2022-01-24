import { CreateListUseCase } from "./";

describe("CreateListUseCase.#execute", () => {
  it("creates a list", async () => {
    const repository = {
      create: jest.fn(),
    };

    repository.create.mockResolvedValue({ id: 55 });

    const useCase = new CreateListUseCase({ repository });
    const result = await useCase.execute({ name: "list" });

    expect(result).toStrictEqual({ id: 55 });
    expect(repository.create.mock.calls[0][0]).toStrictEqual({ name: "list" });
  });
});
