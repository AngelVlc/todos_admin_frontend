import { cleanup } from "@testing-library/react";
import { ListItem } from "../domain";

afterEach(cleanup);

describe("ListItem", () => {
  describe(".createEmpty()", () => {
    it("creates an empty list item", () => {
      const newListItem = ListItem.createEmpty(5);

      expect(newListItem.id).toBe(-1);
      expect(newListItem.listId).toBe(5);
      expect(newListItem.title).toBe("");
      expect(newListItem.description).toBe("");
      expect(newListItem.state).toBe(undefined);
    });
  });
});