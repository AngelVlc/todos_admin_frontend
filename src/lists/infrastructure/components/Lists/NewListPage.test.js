import { render, cleanup } from "@testing-library/react";
import { NewListPage } from "./NewListPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouterForNewList = () => {
  const fakeGetCategoriesUseCase = {
    execute: () => [{ id: 1, name: "category1" }],
  };

  const useCaseFactory = {
    get: (useCase) => fakeGetCategoriesUseCase,
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/new`]}>
          <Route path="/lists/new">
            <NewListPage />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("NewListPage", () => {
  it("should match the snapshot for a new list", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouterForNewList();
      fragment = asFragment;
    });

    expect(fragment()).toMatchSnapshot();
  });
});
