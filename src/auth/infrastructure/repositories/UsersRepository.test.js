import axios from "axios";
import { UsersRepository } from ".";

jest.mock("axios");

describe("UsersRepository", () => {
  describe("#getById", () => {
    it("does a http get request and return its result", async () => {
      const expectedResult = { id: 1, name: 'user1', isAdmin: true };

      axios.get.mockResolvedValue({
        data: expectedResult,
      });

      const result = await new UsersRepository().getById(1);
      expect(axios.get.mock.calls[0][0]).toBe('users/1');
      expect(result).toBe(expectedResult);
    });
  });

  describe("#deleteById", () => {
    it("and returns true if the response has a 204 status", async() => {
      axios.delete.mockResolvedValue({ status: 204 });

      const result = await new UsersRepository().deleteById(1);
      expect(result).toBe(true);
    });

    it("and returns false if the response does not have a 204 status", async() => {
      axios.delete.mockResolvedValue({ status: 500 });

      const result = await new UsersRepository().deleteById(1);

      expect(axios.delete.mock.calls.length).toBe(1);
      expect(axios.delete.mock.calls[0][0]).toBe('users/1');
      expect(result).toBe(false);
    });
  });
});