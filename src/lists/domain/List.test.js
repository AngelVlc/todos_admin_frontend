import { cleanup } from "@testing-library/react";
import { List, ListItem } from "../domain";

afterEach(cleanup);

describe("List", () => {
  describe(".createEmpty()", () => {
    it("creates an empty list", () => {
      const newList = List.createEmpty();

      expect(newList.id).toBe(-1);
      expect(newList.name).toBe("");
      expect(newList.items).toStrictEqual([]);
      expect(newList.itemsCount).toBe(0);
    });
  });

  describe("#addNewItem(newItem)", () => {
    describe("when the list still does not have any item", () => {
      it("adds the new item with id = -1", () => {
        const list = new List({ id: 1 });
        const newItem = new ListItem({
          title: "title",
          description: "desc",
          listId: 1,
        });

        list.addNewItem(newItem);

        expect(list.items.length).toBe(1);
        expect(list.items[0].id).toBe(-1);
      });
    });

    describe("when the list already has an item that is a new item", () => {
      it("adds the new item with id = -2", () => {
        const list = new List({ id: 1 });
        const existingItem = new ListItem({ id: -1 });
        list.items = [existingItem];
        const newItem = new ListItem({
          title: "title",
          description: "desc",
          listId: 1,
        });

        list.addNewItem(newItem);

        expect(list.items.length).toBe(2);
        expect(list.items[1].id).toBe(-2);
      });
    });

    describe("when the list already has an item that is not a new item", () => {
      it("adds the new item with id = -1", () => {
        const list = new List({ id: 1 });
        const newItem = new ListItem({
          id: 10,
          title: "title",
          description: "desc",
          listId: 1,
        });
        const existingItem = new ListItem({ id: 10 });
        list.items = [existingItem];
        list.addNewItem(newItem);

        expect(list.items.length).toBe(2);
        expect(list.items[1].id).toBe(-1);
      });
    });
  });
});
