import axios from "axios";
import { CategoriesRepository } from ".";

jest.mock("axios");

describe("CategoriesRepository", () => {
  describe("#getById", () => {
    it("does a http get request and return its result", async () => {
      const expectedResult = { id: 1 };

      axios.get.mockResolvedValue({
        data: expectedResult,
      });

      const result = await new CategoriesRepository().getById(1);
      expect(axios.get.mock.calls[0][0]).toBe("categories/1");
      expect(result).toBe(expectedResult);
    });
  });

  describe("#deleteById", () => {
    it("does a http delete request and returns true if the response has a 204 status", async () => {
      axios.delete.mockResolvedValue({ status: 204 });

      const result = await new CategoriesRepository().deleteById(1);
      expect(result).toBe(true);
    });

    it("does a http delete request and returns false if the response does not have a 204 status", async () => {
      axios.delete.mockResolvedValue({ status: 500 });

      const result = await new CategoriesRepository().deleteById(1);

      expect(axios.delete).toHaveBeenCalled();
      expect(axios.delete.mock.calls[0][0]).toBe("categories/1");
      expect(result).toBe(false);
    });
  });

  describe("#getAll", () => {
    it("does a http get request and return its result", async () => {
      const expectedResult = [{ id: 1 }, { id: 2 }];

      axios.get.mockResolvedValue({
        data: expectedResult,
      });

      const result = await new CategoriesRepository().getAll();
      expect(axios.get.mock.calls[0][0]).toBe("categories");
      expect(result).toBe(expectedResult);
    });
  });

  describe("#create", () => {
    it("does a http post request and returns the new category if the response has a 201 status", async () => {
      axios.post.mockResolvedValue({ data: { id: 1 }, status: 201 });

      const result = await new CategoriesRepository().create({
        name: "category",
      });
      expect(result).toStrictEqual({ id: 1 });
    });

    it("does a http post request and returns undefined if the response does not have a 201 status", async () => {
      axios.post.mockResolvedValue({ data: { id: 1 }, status: 500 });

      const result = await new CategoriesRepository().create({
        name: "category",
      });

      expect(axios.post).toHaveBeenCalled();
      expect(axios.post.mock.calls[0][0]).toBe("categories");
      expect(result).toBe(undefined);
    });
  });

  describe("#update", () => {
    it("does a http put request and returns the updated category if the response has a 200 status", async () => {
      axios.patch.mockResolvedValue({ data: { id: 1 }, status: 200 });

      const result = await new CategoriesRepository().update({
        id: 5,
        name: "updated",
      });

      expect(result).toStrictEqual({ id: 1 });
    });

    it("does a http put request and returns undefined if the response does not have a 200 status", async () => {
      axios.patch.mockResolvedValue({ data: { id: 5 }, status: 500 });

      const result = await new CategoriesRepository().update({
        id: 5,
        name: "updated",
      });

      expect(axios.patch).toHaveBeenCalled();
      expect(axios.patch.mock.calls[0][0]).toBe("categories/5");
      expect(axios.patch.mock.calls[0][1]).toStrictEqual({
        id: 5,
        name: "updated",
      });
      expect(result).toBe(undefined);
    });
  });
});
