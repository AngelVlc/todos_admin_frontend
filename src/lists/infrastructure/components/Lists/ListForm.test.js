import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { ListForm } from "./ListForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import {
  mockGetComputedStyle,
  mockDndSpacing,
  makeDnd,
  DND_DIRECTION_DOWN,
} from "react-beautiful-dnd-test-utils";
import { CreateListUseCase } from "../../../application/lists";
import { List, ListItem } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockedCreateListUseCase = {
  execute: jest.fn(),
};

const mockedUpdateListUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) => useCase == CreateListUseCase ? mockedCreateListUseCase : mockedUpdateListUseCase,
};

beforeEach(() => {
  mockGetComputedStyle();
});

afterEach(cleanup);

describe("when the list already exist", () => {
  const renderWithContextAndRouterForExistingList = () => {
    const list = new List({ id: 2, name: "list name" });
    list.items = [
      new ListItem({
        id: 5,
        title: "item 5 title",
        description: "item 5 description",
      }),
      new ListItem({
        id: 6,
        title: "item 6 title",
        description: "item 6 description",
      }),
    ];

    const context = { auth: { info: {} }, useCaseFactory };
    return {
      ...render(
        <AppContext.Provider value={context}>
          <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
            <Route path="/lists/:listId/items/:itemId/edit">
              <ListForm list={list} />
            </Route>
          </MemoryRouter>
        </AppContext.Provider>
      ),
    };
  };

  it("should match the snapshot", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouterForExistingList();
      fragment = asFragment;
    });
    expect(fragment()).toMatchSnapshot();
  });

  it("should allow to update the list", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouterForExistingList();
      mockDndSpacing(container.container);
    });

    await makeDnd({
      getDragElement: () => container.getByTestId("draggable5"),
      direction: DND_DIRECTION_DOWN,
      positions: 1,
    });

    await changeInputValue(container.getByTestId, "name", "updated name");

    mockedUpdateListUseCase.execute.mockResolvedValue({ id: 2 });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("submit"));
    });

    expect(mockedUpdateListUseCase.execute.mock.calls.length).toBe(1);
    const items = [
      new ListItem({
        id: 6,
        title: "item 6 title",
        description: "item 6 description",
      }),
      new ListItem({
        id: 5,
        title: "item 5 title",
        description: "item 5 description",
      }),
    ];
    const list = new List({
      id: 2,
      name: "updated name"      
    });
    list.items = items;
    expect(mockedUpdateListUseCase.execute.mock.calls[0][0]).toStrictEqual(
      list
    );
  });

  it("should add a new item", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouterForExistingList();
    });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("addNew"));
    });

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/2/items/new");
    mockHistoryPush.mockClear();
  });

  it("should update an existing item", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouterForExistingList();
    });

    expect(container.getByTestId("editListItem5").href).toBe(
      "http://localhost/lists/2/items/5/edit"
    );
  });

  it("should allow delete an existing item", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouterForExistingList();
    });

    expect(container.getByTestId("deleteListItem5").href).toBe(
      "http://localhost/lists/2/items/5/delete"
    );
  });
});

describe("when the list is new", () => {
  const renderWithContextAndRouterForNewList = () => {
    const context = { auth: { info: {} }, useCaseFactory };
    return {
      ...render(
        <AppContext.Provider value={context}>
          <MemoryRouter initialEntries={[`/users/new`]}>
            <Route path="/users/new">
              <ListForm list={List.createEmpty()} />
            </Route>
          </MemoryRouter>
        </AppContext.Provider>
      ),
    };
  };

  it("should match the snapshot", async () => {
    const { asFragment } = renderWithContextAndRouterForNewList();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should allow to cancel", async () => {
    const { getByTestId } = renderWithContextAndRouterForNewList();

    await waitFor(() => {
      fireEvent.click(getByTestId("cancel"));
    });

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists");
    mockHistoryPush.mockClear();
  });

  it("should require the list name", async () => {
    const { getByTestId } = renderWithContextAndRouterForNewList();

    await waitFor(() => {
      fireEvent.click(getByTestId("submit"));
    });

    expect(getByTestId("nameErrors")).toHaveTextContent("Required");
  });

  it("should allow to create a new list", async () => {
    const { getByTestId } = renderWithContextAndRouterForNewList();

    await changeInputValue(getByTestId, "name", "new list");

    mockedCreateListUseCase.execute.mockResolvedValue({ id: 55 });

    await waitFor(() => {
      fireEvent.click(getByTestId("submit"));
    });

    expect(mockedCreateListUseCase.execute.mock.calls.length).toBe(1);
    const list = new List({
      name: "new list",
      itemsCount: 0,
    });
    expect(mockedCreateListUseCase.execute.mock.calls[0][0]).toStrictEqual(
      list
    );

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/55");
    mockHistoryPush.mockClear();
  });
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
