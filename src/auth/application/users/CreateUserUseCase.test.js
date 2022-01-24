import { CreateUserUseCase } from "./";

describe("CreateUserUseCase.#execute", () => {
  it("creates a user", async () => {
    const repository = {
      create: jest.fn(),
    };

    repository.create.mockResolvedValue({ id: 55 });

    const useCase = new CreateUserUseCase({ repository });
    const result = await useCase.execute({ name: "user" });

    expect(result).toStrictEqual({ id: 55 });
    expect(repository.create.mock.calls[0][0]).toStrictEqual({ name: "user" });
  });
});
