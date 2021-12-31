import { RefreshToken } from "../../domain";
import { GetRefreshTokensUseCase } from ".";

describe("GetRefreshTokensUseCase.#execute", () => {
  it("gets the refresh tokens", async () => {
    const repository = {
      getAll: () => {
        return [
          {
            id: 1,
            userId: 1,
            expirationDate: "exp1",
          },
          {
            id: 2,
            userId: 3,
            expirationDate: "exp2",
          },
        ];
      },
    };

    const useCase = new GetRefreshTokensUseCase({ repository });
    const result = await useCase.execute();

    expect(result).toStrictEqual([
      new RefreshToken({
        id: 1,
        userId: 1,
        expirationDate: "exp1",
      }),
      new RefreshToken({
        id: 2,
        userId: 3,
        expirationDate: "exp2",
      }),
    ]);
  });
});
