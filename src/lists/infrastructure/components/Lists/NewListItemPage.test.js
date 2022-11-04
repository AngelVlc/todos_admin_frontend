import { render, cleanup } from "@testing-library/react";
import { NewListItemPage } from "./NewListItemPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { List } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouterForNewItem = () => {
  const mockedGetListByIdUseCase = {
    execute: jest.fn(),
  };

  const useCaseFactory = {
    get: () => {
      return mockedGetListByIdUseCase;
    },
  };

  mockedGetListByIdUseCase.execute.mockResolvedValue(
    new List({ id: 2, name: "list name" })
  );

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/items/new`]}>
          <Route path="/lists/:listId/items/new">
            <NewListItemPage />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot for a new item", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouterForNewItem();
      fragment = asFragment;
    });
    expect(fragment()).toMatchSnapshot();
});
