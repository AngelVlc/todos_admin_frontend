import axios from "axios";
import { ListItemsRepository } from ".";

jest.mock("axios");

describe("ListItemsRepository", () => {
  describe("#getById", () => {
    it("does a http get request and return its result", async () => {
      const expectedResult = {
        id: 1,
        title: "title1",
        descrption: "desc",
        listId: 1,
      };

      axios.get.mockResolvedValue({
        data: expectedResult,
      });

      const result = await new ListItemsRepository().getById(1, 2);
      expect(axios.get.mock.calls[0][0]).toBe("lists/1/items/2");
      expect(result).toBe(expectedResult);
    });
  });

  describe("#deleteById", () => {
    it("does a http delete request and returns true if the response has a 204 status", async () => {
      axios.delete.mockResolvedValue({ status: 204 });

      const result = await new ListItemsRepository().deleteById(1, 2);
      expect(result).toBe(true);
    });

    it("does a http delete request returns false if the response does not have a 204 status", async () => {
      axios.delete.mockResolvedValue({ status: 500 });

      const result = await new ListItemsRepository().deleteById(1, 2);

      expect(axios.delete).toHaveBeenCalled();
      expect(axios.delete.mock.calls[0][0]).toBe("lists/1/items/2");
      expect(result).toBe(false);
    });
  });

  describe("#getAllByListId", () => {
    it("does a http get request and return its result", async () => {
      const expectedResult = [
        { id: 1, title: "item1", description: "desc", listId: 1 },
        { id: 2, title: "item2", description: "desc", listId: 1 },
      ];

      axios.get.mockResolvedValue({
        data: expectedResult,
      });

      const result = await new ListItemsRepository().getAllByListId(1);

      expect(axios.get.mock.calls[0][0]).toBe("lists/1/items");
      expect(result).toBe(expectedResult);
    });
  });

  describe("#create", () => {
    it("does a http post request and returns the new list item if the response has a 201 status", async () => {
      axios.post.mockResolvedValue({ data: { id: 1 }, status: 201 });

      const result = await new ListItemsRepository().create({
        name: "list",
        listId: 5,
      });
      expect(result).toStrictEqual({ id: 1 });
    });

    it("does a http post request returns undefined if the response does not have a 201 status", async () => {
      axios.post.mockResolvedValue({ data: { id: 1 }, status: 500 });

      const result = await new ListItemsRepository().create({
        name: "list",
        listId: 5,
      });

      expect(axios.post).toHaveBeenCalled();
      expect(axios.post.mock.calls[0][0]).toBe("lists/5/items");
      expect(axios.post.mock.calls[0][1]).toStrictEqual({
        name: "list",
        listId: 5,
      });
      expect(result).toBe(undefined);
    });
  });

  describe("#update", () => {
    it("does a http put request and returns the updated list if the response has a 200 status", async () => {
      axios.patch.mockResolvedValue({ data: { id: 1 }, status: 200 });

      const result = await new ListItemsRepository().update({
        id: 1,
        name: "list",
        listId: 5,
      });
      expect(result).toStrictEqual({ id: 1 });
    });

    it("does a http put request returns undefined if the response does not have a 200 status", async () => {
      axios.patch.mockResolvedValue({ data: { id: 5 }, status: 500 });

      const result = await new ListItemsRepository().update({
        id: 1,
        name: "list",
        listId: 5,
      });

      expect(axios.patch).toHaveBeenCalled();
      expect(axios.patch.mock.calls[0][0]).toBe("lists/5/items/1");
      expect(axios.patch.mock.calls[0][1]).toStrictEqual({
        id: 1,
        name: "list",
        listId: 5,
      });
      expect(result).toBe(undefined);
    });
  });
});
