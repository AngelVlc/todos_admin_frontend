import { UpdateUserUseCase } from "./";

describe("UpdateUserUseCase.#execute", () => {
  it("updates a user", async () => {
    const repository = {
      update: jest.fn(),
    };

    repository.update.mockResolvedValue({ id: 44 });

    const useCase = new UpdateUserUseCase({ repository });
    const result = await useCase.execute({ id: 1 });

    expect(result).toStrictEqual({ id: 44 });
    expect(repository.update.mock.calls[0][0]).toStrictEqual({ id: 1 });
  });
});
