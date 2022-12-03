import { render, cleanup } from "@testing-library/react";
import { NewUserPage } from "./NewUserPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouterForNewUser = () => {
  const context = { auth: { info: {} } };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/users/new`]}>
          <Route path="/users/new">{<NewUserPage />}</Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("NewUserPage", () => {
  it("should match the snapshot for a new user", async () => {
    const { asFragment } = renderWithContextAndRouterForNewUser();

    expect(asFragment()).toMatchSnapshot();
  });
});
