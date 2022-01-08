import { User } from "../../domain";
import { GetUserByIdUseCase } from "./";

describe("GetUserByIdUseCase.#execute", () => {
  it("gets a user", async () => {
    const repository = {
      getById: jest.fn(),
    };

    repository.getById.mockResolvedValue({
      id: 1,
      name: "name",
      isAdmin: true,
    });

    const useCase = new GetUserByIdUseCase({ repository });
    const result = await useCase.execute(1);

    expect(repository.getById.mock.calls[0][0]).toBe(1);
    expect(result).toStrictEqual(
      new User({
        id: 1,
        name: "name",
        isAdmin: true,
      })
    );
  });
});
