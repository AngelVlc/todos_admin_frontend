import axios from "axios";
import { RefreshTokensRepository } from ".";

jest.mock("axios");

describe("RefreshTokensRepository", () => {
  describe("#getAll", () => {
    it("does a http get request and return its result with custom parameters", async () => {
      const expectedResult = [
        { id: 1, userId: 1, expirationDate: "2021-01-29T16:46:58Z" },
        { id: 2, userId: 2, expirationDate: "2021-03-29T16:46:58Z" },
      ];

      axios.get.mockResolvedValue({
        data: expectedResult,
      });

      const result = await new RefreshTokensRepository().getAll({
        pageNumber: 4,
        pageSize: 20,
        sortColumn: "userId",
        sortOrder: "desc",
      });
      expect(axios.get.mock.calls[0][0]).toBe(
        "refreshtokens?page=4&page_size=20&sort=userId&order=desc"
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe("#deleteByIds", () => {
    describe("does a http delete request", () => {
      it("and returns true if the response has a 204 status", async () => {
        const ids = [1, 2, 3];

        axios.delete.mockResolvedValue({ status: 204 });

        const result = await new RefreshTokensRepository().deleteByIds(ids);
        expect(result).toBe(true);
      });

      it("and returns false if the response does not have a 204 status", async () => {
        const ids = [1, 3];

        axios.delete.mockResolvedValue({ status: 500 });

        const result = await new RefreshTokensRepository().deleteByIds(ids);

        expect(axios.delete.mock.calls.length).toBe(1);
        expect(axios.delete.mock.calls[0][0]).toBe("refreshtokens");
        expect(axios.delete.mock.calls[0][1]).toStrictEqual({ data: [1, 3] });
        expect(result).toBe(false);
      });
    });
  });
});
