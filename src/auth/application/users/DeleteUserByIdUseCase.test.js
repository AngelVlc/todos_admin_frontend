import { DeleteUserByIdUseCase } from "./";

describe("DeleteUserByIdUseCase.#execute", () => {
  it("deletes a user", async () => {
    const repository = {
      deleteById: () => true,
    };

    const useCase = new DeleteUserByIdUseCase({ repository });
    const result = await useCase.execute();

    expect(result).toBe(true);
  });
});
