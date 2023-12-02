import { render, cleanup } from "@testing-library/react";
import { NewCategoryPage } from "./NewCategoryPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouterFor = () => {
  const context = { auth: { info: {} } };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/categories/new`]}>
          <Route path="/categories/new">
            <NewCategoryPage />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("NewCategoryPage", () => {
  it("should match the snapshot for a new category", async () => {
    const { asFragment } = renderWithContextAndRouterFor();

    expect(asFragment()).toMatchSnapshot();
  });
});
