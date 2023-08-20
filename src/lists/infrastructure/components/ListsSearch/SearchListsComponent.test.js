import { render, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { SearchListsComponent } from "./SearchListsComponent";
import algoliasearch from "algoliasearch/lite";

jest.mock("algoliasearch");

describe("SearchListsComponent", () => {
  const renderComponent = (searchSecureKey) => {
    return {
      ...render(<SearchListsComponent searchSecureKey={searchSecureKey} />),
    };
  };

  afterEach(cleanup);

  describe("when the secure key is empty", () => {
    it("should match the snapshot", () => {
      process.env.REACT_APP_ALGOLIA_APP_ID = "app_id";

      const { asFragment } = renderComponent("");

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("when the secure key is not empty", () => {
    it("should match the snapshot", async () => {
      process.env.REACT_APP_ALGOLIA_APP_ID = "app_id";

      algoliasearch.mockReturnValueOnce({
        search: () =>
          new Promise((resolve) => resolve({ results: [{ hits: [] }] })),
      });

      let fragment;
      await act(async () => {
        const { asFragment } = renderComponent("search_secure_key");
        fragment = asFragment;
      });
  
      expect(fragment()).toMatchSnapshot();
    });
  });
});
