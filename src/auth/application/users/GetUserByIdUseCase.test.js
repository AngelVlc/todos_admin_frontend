import { User } from "../../domain";
import { GetUserByIdUseCase } from "./";

describe("GetUserByIdUseCase.#execute", () => {
  it("gets a user", async () => {
    const repository = {
      getById: () => {
        return {
          id: 1,
          name: "name",
          isAdmin: true,
        };
      },
    };

    const useCase = new GetUserByIdUseCase({ repository });
    const result = await useCase.execute();

    expect(result).toStrictEqual(
      new User({
        id: 1,
        name: "name",
        isAdmin: true,
      })
    );
  });
});
