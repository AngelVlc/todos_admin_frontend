import { User } from "../../domain";
import { GetUsersUseCase } from ".";

describe("GetUsersUseCase.#execute", () => {
  it("gets the users", async () => {
    const repository = {
      getAll: () => {
        return [
          {
            id: 1,
            name: "user1",
            isAdmin: true,
          },
          {
            id: 2,
            name: "user2",
            isAdmin: false,
          },
        ];
      },
    };

    const useCase = new GetUsersUseCase({ repository });
    const result = await useCase.execute();

    expect(result).toStrictEqual([
      new User({
        id: 1,
        name: "user1",
        isAdmin: true,
      }),
      new User({
        id: 2,
        name: "user2",
        isAdmin: false,
      }),
    ]);
  });
});
