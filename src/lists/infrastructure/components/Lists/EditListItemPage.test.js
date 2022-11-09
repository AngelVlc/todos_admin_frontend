import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
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
  const fakeGetListByIdUseCase = {
    execute: () => new List({ id: 2, name: "list name" }),
  };

  const fakeGetListItemByIdUseCase = {
    execute: () =>
      new ListItem({
        id: 5,
        title: "item title",
        description: "item description",
        listId: 2,
      }),
  };

  const useCaseFactory = {
    get: (useCase) =>
      useCase == GetListByIdUseCase
        ? fakeGetListByIdUseCase
        : fakeGetListItemByIdUseCase,
  };

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

it("should allow delete an existing item", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouterForExistingItem();
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("delete"));
  });

  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/2/items/5/delete");
  mockHistoryPush.mockClear();
});
