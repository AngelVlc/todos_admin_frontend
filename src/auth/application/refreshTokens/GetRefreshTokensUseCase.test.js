import { RefreshToken } from "../../domain";
import { GetRefreshTokensUseCase } from ".";

describe("GetRefreshTokensUseCase.#execute", () => {
  it("gets the refresh tokens", async () => {
    const repository = {
      getAll: jest.fn(),
    };

    repository.getAll.mockResolvedValue([
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
    ]);

    const useCase = new GetRefreshTokensUseCase({ repository });
    const result = await useCase.execute({
      pageNumber: 2,
      pageSize: 20,
      sortColumn: "userId",
      sortOrder: "desc",
    });

    expect(repository.getAll.mock.calls[0][0]).toStrictEqual({
      pageNumber: 2,
      pageSize: 20,
      sortColumn: "userId",
      sortOrder: "desc",
    });
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
