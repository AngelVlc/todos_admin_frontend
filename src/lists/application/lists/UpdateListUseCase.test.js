import { UpdateListUseCase } from "./";

describe("UpdateListUseCase.#execute", () => {
  it("updates a list", async () => {
    const repository = {
      update: jest.fn(),
    };

    repository.update.mockResolvedValue({ id: 44 });

    const useCase = new UpdateListUseCase({ repository });
    const result = await useCase.execute({
      id: 44,
      items: [{ id: 2 }, { id: 3 }],
    });

    expect(result).toStrictEqual({ id: 44 });
    expect(repository.update.mock.calls[0][0].id).toBe(44);
    expect(repository.update.mock.calls[0][0].idsByPosition).toStrictEqual([
      2, 3,
    ]);
  });
});
