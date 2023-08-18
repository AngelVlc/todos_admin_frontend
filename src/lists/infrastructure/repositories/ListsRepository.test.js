import axios from "axios";
import { ListsRepository } from ".";

jest.mock("axios");

describe("ListsRepository", () => {
  describe("#getById", () => {
    it("does a http get request and return its result", async () => {
      const expectedResult = { id: 1 };

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

    it("does a http delete request and returns false if the response does not have a 204 status", async () => {
      axios.delete.mockResolvedValue({ status: 500 });

      const result = await new ListsRepository().deleteById(1);

      expect(axios.delete).toHaveBeenCalled();
      expect(axios.delete.mock.calls[0][0]).toBe("lists/1");
      expect(result).toBe(false);
    });
  });

  describe("#getAll", () => {
    it("does a http get request and return its result", async () => {
      const expectedResult = [{ id: 1 }, { id: 2 }];

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
      axios.post.mockResolvedValue({ data: { id: 1 }, status: 201 });

      const result = await new ListsRepository().create({
        name: "list",
        items: [{ id: -1, title: "title" }],
      });
      expect(result).toStrictEqual({ id: 1 });
    });

    it("does a http post request and returns undefined if the response does not have a 201 status", async () => {
      axios.post.mockResolvedValue({ data: { id: 1 }, status: 500 });

      const result = await new ListsRepository().create({
        name: "list",
        items: [{ id: -1, title: "title" }],
      });

      expect(axios.post).toHaveBeenCalled();
      expect(axios.post.mock.calls[0][0]).toBe("lists");
      expect(axios.post.mock.calls[0][1]).toStrictEqual({
        name: "list",
        items: [{ title: "title" }],
      });
      expect(result).toBe(undefined);
    });
  });

  describe("#update", () => {
    it("does a http put request and returns the updated list if the response has a 200 status", async () => {
      axios.patch.mockResolvedValue({ data: { id: 1 }, status: 200 });

      const result = await new ListsRepository().update({
        id: 5,
        name: "a",
        items: [
          { id: -1, title: "new" },
          { id: 2, title: "existing" },
        ],
      });

      expect(result).toStrictEqual({ id: 1 });
    });

    it("does a http put request and returns undefined if the response does not have a 200 status", async () => {
      axios.patch.mockResolvedValue({ data: { id: 5 }, status: 500 });

      const result = await new ListsRepository().update({
        id: 5,
        name: "a",
        items: [
          { id: -1, title: "new" },
          { id: 2, title: "existing" },
        ],
      });

      expect(axios.patch).toHaveBeenCalled();
      expect(axios.patch.mock.calls[0][0]).toBe("lists/5");
      expect(axios.patch.mock.calls[0][1]).toStrictEqual({
        id: 5,
        name: "a",
        items: [{ title: "new" }, { id: 2, title: "existing" }],
      });
      expect(result).toBe(undefined);
    });
  });

  describe("#moveListItem", () => {
    it("does a http post request and returns true if the response has a 200 status", async () => {
      axios.post.mockResolvedValue({ status: 200 });

      const result = await new ListsRepository().moveListItem(1, 11, 2);
      expect(result).toBe(true);
    });

    it("does a http post request and returns false if the response does not have a 200 status", async () => {
      axios.post.mockResolvedValue({ status: 500 });

      const result = await new ListsRepository().moveListItem(1, 11, 2);

      expect(axios.post).toHaveBeenCalled();
      expect(axios.post.mock.calls[0][0]).toBe("lists/1/move_item");
      expect(result).toBe(false);
    });
  });

  describe('#indexAllLists', () => {
    it("does a http post request and returns true if the response has a 204 status", async () => {
      axios.post.mockResolvedValue({ status: 204 });

      const result = await new ListsRepository().indexAllLists();
      expect(result).toBe(true);
    });

    it("does a http post request and returns false if the response does not have a 204 status", async () => {
      axios.post.mockResolvedValue({ status: 500 });

      const result = await new ListsRepository().indexAllLists();

      expect(axios.post).toHaveBeenCalled();
      expect(axios.post.mock.calls[0][0]).toBe("tools/index-lists");
      expect(result).toBe(false);
    });
  })
});
