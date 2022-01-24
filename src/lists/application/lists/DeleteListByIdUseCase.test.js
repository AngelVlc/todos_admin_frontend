import { DeleteListByIdUseCase } from "./";

describe("DeleteListByIdUseCase.#execute", () => {
  it("deletes a list", async () => {
    const repository = {
      deleteById: jest.fn(),
    };

    repository.deleteById.mockResolvedValue(true);

    const useCase = new DeleteListByIdUseCase({ repository });
    const result = await useCase.execute(55);

    expect(result).toBe(true);
    expect(repository.deleteById.mock.calls[0][0]).toBe(55);
  });
});
