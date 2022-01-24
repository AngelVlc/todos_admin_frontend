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

  describe("#getAll", () => {
    it("does a http get request and return its result", async () => {
      const expectedResult = [
        { id: 1, name: "list1", itemsCount: 3 },
        { id: 2, name: "list2", itemsCount: 10 },
      ];

      axios.get.mockResolvedValue({
        data: expectedResult,
      });

      const result = await new ListsRepository().getAll();
      expect(axios.get.mock.calls[0][0]).toBe("lists");
      expect(result).toBe(expectedResult);
    });
  });

  describe("#create", () => {
    it("does a http post request and returns the new list if the response has a 201 status", async () => {
      axios.post.mockResolvedValue({ data: {id: 1}, status: 201 });

      const result = await new ListsRepository().create({});
      expect(result).toStrictEqual({id: 1});
    });

    it("does a http post request returns undefined if the response does not have a 201 status", async () => {
      axios.post.mockResolvedValue({ data: {id: 1}, status: 500 });

      const result = await new ListsRepository().create({ name: 'list' });

      expect(axios.post.mock.calls.length).toBe(1);
      expect(axios.post.mock.calls[0][0]).toBe("lists");
      expect(axios.post.mock.calls[0][1]).toStrictEqual({ name: 'list' });
      expect(result).toBe(undefined);
    });
  });

  describe("#update", () => {
    it("does a http put request and returns the updated list if the response has a 200 status", async () => {
      axios.put.mockResolvedValue({ data: {id: 1}, status: 200 });

      const result = await new ListsRepository().update({});
      expect(result).toStrictEqual({id: 1});
    });

    it("does a http put request returns undefined if the response does not have a 200 status", async () => {
      axios.put.mockResolvedValue({ data: {id: 5}, status: 500 });

      const result = await new ListsRepository().update({ id: 5, name: 'a' });

      expect(axios.put.mock.calls.length).toBe(1);
      expect(axios.put.mock.calls[0][0]).toBe("lists/5");
      expect(axios.put.mock.calls[0][1]).toStrictEqual({ id: 5, name: 'a' });
      expect(result).toBe(undefined);
    });
  });
});
