import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { EditCategoryPage } from "./EditCategoryPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { Category } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouter = () => {
  const fakeGetCategoryByIdUseCase = {
    execute: () => {
      return new Category({
        id: 2,
        name: "category name",
        description: "category description",
      });
    },
  };

  const useCaseFactory = {
    get: () => fakeGetCategoryByIdUseCase,
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/categories/2`]}>
          <Route path="/categories/:categoryId">
            <EditCategoryPage />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("EditCategoryPage", () => {
  it("should match the snapshot for an existing category", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouter();
      fragment = asFragment;
    });

    expect(fragment()).toMatchSnapshot();
  });
});
