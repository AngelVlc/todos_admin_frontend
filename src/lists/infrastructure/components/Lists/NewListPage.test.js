import { render, cleanup } from "@testing-library/react";
import { NewListPage } from "./NewListPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouterForNewList = () => {
  const context = { auth: { info: {} } };
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
    const { asFragment } = renderWithContextAndRouterForNewList();

    expect(asFragment()).toMatchSnapshot();
  });
});
