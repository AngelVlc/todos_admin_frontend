import { render, cleanup } from "@testing-library/react";
import { EditListItemPage } from "./EditListItemPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { List, ListItem } from "../../../domain";
import { GetListByIdUseCase } from "../../../application/lists";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouterForExistingItem = () => {
  const mockedGetListByIdUseCase = {
    execute: jest.fn(),
  };

  const mockedGetListItemByIdUseCase = {
    execute: jest.fn(),
  };

  const useCaseFactory = {
    get: (useCase) => {
      if (useCase == GetListByIdUseCase) {
        return mockedGetListByIdUseCase;
      }

      return mockedGetListItemByIdUseCase;
    },
  };

  mockedGetListByIdUseCase.execute.mockResolvedValue(
    new List({ id: 2, name: "list name" })
  );

  mockedGetListItemByIdUseCase.execute.mockResolvedValue(
    new ListItem({
      id: 5,
      title: "item title",
      description: "item description",
      listId: 2,
    })
  );

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
          <Route path="/lists/:listId/items/:itemId/edit">
            <EditListItemPage />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot for an existing item", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouterForExistingItem();
    fragment = asFragment;
  });
  expect(fragment()).toMatchSnapshot();
});
