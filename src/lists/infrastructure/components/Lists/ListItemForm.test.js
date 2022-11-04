import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { ListItemForm } from "./ListItemForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { CreateListItemUseCase } from "../../../application/listItems";
import { ListItem } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockedCreateListItemUseCase = {
  execute: jest.fn(),
};

const mockedUpdateListItemUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) => {
    if (useCase == CreateListItemUseCase) {
      return mockedCreateListItemUseCase;
    }

    return mockedUpdateListItemUseCase;
  },
};

const renderWithContextAndRouterForExistingItem = () => {
  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
          <Route path="/lists/:listId/items/:itemId/edit">
            <ListItemForm
              listItem={
                new ListItem({
                  listId: 2,
                  id: 5,
                  title: "item title",
                  description: "item description",
                })
              }
            />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

const renderWithContextAndRouterForNewItem = () => {
  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/items/new`]}>
          <Route path="/lists/:listId/items/new">
            <ListItemForm listItem={ListItem.createEmpty(2)} />
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

it("should match the snapshot for a new item", async () => {
  const { asFragment } = renderWithContextAndRouterForNewItem();
  expect(asFragment()).toMatchSnapshot();
});

it("should allow cancel", async () => {
  const { getByTestId } = renderWithContextAndRouterForNewItem();

  await waitFor(() => {
    fireEvent.click(getByTestId("cancel"));
  });

  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/2");
  mockHistoryPush.mockClear();
});

it("should require item title", async () => {
  const { getByTestId } = renderWithContextAndRouterForNewItem();

  await waitFor(() => {
    fireEvent.click(getByTestId("submit"));
  });

  expect(getByTestId("titleErrors")).toHaveTextContent("Required");
});

it("should update an existing item", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouterForExistingItem();
  });

  await changeInputValue(container.getByTestId, "title", "updated title");
  await changeInputValue(
    container.getByTestId,
    "description",
    "updated description"
  );

  mockedUpdateListItemUseCase.execute.mockResolvedValue({});

  await waitFor(() => {
    fireEvent.click(container.getByTestId("submit"));
  });

  expect(mockedUpdateListItemUseCase.execute.mock.calls.length).toBe(1);
  const listItem = new ListItem({
    id: 5,
    listId: 2,
    title: "updated title",
    description: "updated description",
  });
  expect(mockedUpdateListItemUseCase.execute.mock.calls[0][0]).toStrictEqual(
    listItem
  );

  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/2");
  mockHistoryPush.mockClear();
});

it("should create a new item", async () => {
  const { getByTestId } = renderWithContextAndRouterForNewItem();

  await changeInputValue(getByTestId, "title", "title");
  await changeInputValue(getByTestId, "description", "description");

  mockedCreateListItemUseCase.execute.mockResolvedValue({});

  await waitFor(() => {
    fireEvent.click(getByTestId("submit"));
  });

  expect(mockedCreateListItemUseCase.execute.mock.calls.length).toBe(1);
  const listItem = new ListItem({
    listId: 2,
    title: "title",
    description: "description",
  });
  expect(mockedCreateListItemUseCase.execute.mock.calls[0][0]).toStrictEqual(
    listItem
  );

  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/2");
  mockHistoryPush.mockClear();
});

const changeInputValue = async (getByTestId, name, value) => {
  await waitFor(() => {
    fireEvent.change(getByTestId(name), {
      target: {
        value: value,
      },
    });
  });
};
