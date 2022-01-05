import axios from "axios";
import { ListsRepository } from ".";

jest.mock("axios");

describe("ListsRepository", () => {
  describe("#getById", () => {
    it("does a http get request and return its result", async () => {
      const expectedResult = { id: 1, name: "list1", itemsCount: 2 };

      axios.get.mockResolvedValue({
        data: expectedResult,
      });

      const result = await new ListsRepository().getById(1);
      expect(axios.get.mock.calls[0][0]).toBe("lists/1");
      expect(result).toBe(expectedResult);
    });
  });

  describe("#deleteById", () => {
    it("does a http delete request and returns true if the response has a 204 status", async () => {
      axios.delete.mockResolvedValue({ status: 204 });

      const result = await new ListsRepository().deleteById(1);
      expect(result).toBe(true);
    });

    it("does a http delete request returns false if the response does not have a 204 status", async () => {
      axios.delete.mockResolvedValue({ status: 500 });

      const result = await new ListsRepository().deleteById(1);

      expect(axios.delete.mock.calls.length).toBe(1);
      expect(axios.delete.mock.calls[0][0]).toBe("lists/1");
      expect(result).toBe(false);
    });
  });
});
