import { DeleteListItemByIdUseCase } from "./";

describe("DeleteListItemByIdUseCase.#execute", () => {
  it("deletes a list item", async () => {
    const repository = {
      deleteById: jest.fn(),
    };

    repository.deleteById.mockResolvedValue(true);

    const useCase = new DeleteListItemByIdUseCase({ repository });
    const result = await useCase.execute(55);

    expect(result).toBe(true);
    expect(repository.deleteById.mock.calls[0][0]).toBe(55);
  });
});
