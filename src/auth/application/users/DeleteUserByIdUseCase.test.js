import { DeleteUserByIdUseCase } from "./";

describe("DeleteUserByIdUseCase.#execute", () => {
  it("deletes a user", async () => {
    const repository = {
      deleteById: jest.fn(),
    };

    repository.deleteById.mockResolvedValue(true);

    const useCase = new DeleteUserByIdUseCase({ repository });
    const result = await useCase.execute(55);

    expect(result).toBe(true);
    expect(repository.deleteById.mock.calls[0][0]).toBe(55);
  });
});
