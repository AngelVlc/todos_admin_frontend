import { RefreshToken } from "../../domain";
import { DeleteSelectedRefreshTokensUseCase } from ".";

describe("DeleteSelectedRefreshTokensUseCase", () => {
  it("deletes the refresh tokens that are selected", async () => {
    const notSelectedRefreshToken1 = new RefreshToken({
      id: 1,
      userId: 1,
      expirationDate: "exp",
    });
    const notSelectedRefreshToken2 = new RefreshToken({
      id: 2,
      userId: 1,
      expirationDate: "exp",
    });
    const selectedRefreshToken = new RefreshToken({
      id: 3,
      userId: 1,
      expirationDate: "exp",
    });
    selectedRefreshToken.selected = true;

    const refreshTokens = [
      notSelectedRefreshToken1,
      selectedRefreshToken,
      notSelectedRefreshToken2,
    ];

    const repository = {
      deleteByIds: jest.fn(),
    };
    repository.deleteByIds.mockResolvedValue(true);

    const useCase = new DeleteSelectedRefreshTokensUseCase({ repository });
    const result = await useCase.execute(refreshTokens);

    expect(repository.deleteByIds).toHaveBeenCalled();
    expect(repository.deleteByIds.mock.calls[0][0]).toStrictEqual([3]);
    expect(result).toBe(true);
  });
});
