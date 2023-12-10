import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { ListForm } from "./ListForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import {
  mockGetComputedStyle,
  mockDndSpacing,
  makeDnd,
  DND_DIRECTION_DOWN,
} from "react-beautiful-dnd-test-utils";
import { CreateListUseCase, UpdateListUseCase, GetCategoriesUseCase } from "../../../application";
import { List, ListItem } from "../../../domain";
import { act } from "react-dom/test-utils";

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

const fakeGetCategoriesUseCase = {
  execute: () => [
    { id: 1, name: "category1" },
    { id: 2, name: "category2" },
  ],
};

const useCaseFactory = {
  get: (useCase) => {
    switch (useCase) {
      case GetCategoriesUseCase:
        return fakeGetCategoriesUseCase;
      case CreateListUseCase:
        return mockedCreateListUseCase;
      case UpdateListUseCase:
        return mockedUpdateListUseCase;
      default:
        throw new Error(`Unknown use case ${useCase}`);
    }
  },
};

beforeEach(() => {
  mockGetComputedStyle();
});

afterEach(cleanup);

describe("ListForm", () => {
  describe("when the list already exist", () => {
    const renderWithContextAndRouterForExistingList = () => {
      const list = new List({
        id: 2,
        name: "list name",
        categoryId: 1,
        items: [
          new ListItem({
            id: 5,
            listId: 2,
            title: "item 5 title",
            description: "item 5 description",
          }),
          new ListItem({
            id: 6,
            listId: 2,
            title: "item 6 title",
            description: "item 6 description",
          }),
        ],
      });

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

    it("should allow to update the list name, the category, delete and update an existing item, and add a new item", async () => {
      let container;
      await act(async () => {
        container = renderWithContextAndRouterForExistingList();
      });

      mockDndSpacing(container.container);

      await makeDnd({
        getDragElement: () => container.getByTestId("draggable5"),
        direction: DND_DIRECTION_DOWN,
        positions: 1,
      });

      await waitFor(() => {
        fireEvent.click(container.getByTestId("deleteListItem5"));
      });

      await waitFor(() => {
        fireEvent.click(container.getByTestId("addNew"));
      });

      await changeInputValue(container.getByTestId, "title", "the title");
      await changeInputValue(
        container.getByTestId,
        "description",
        "the description"
      );
      await changeInputValue(container.getByTestId, "categoryId", "2");

      await waitFor(() => {
        fireEvent.click(container.getByTestId("modalOk"));
      });

      await waitFor(() => {
        fireEvent.click(container.getByTestId("editListItem6"));
      });

      await changeInputValue(container.getByTestId, "title", "updated title");
      await changeInputValue(
        container.getByTestId,
        "description",
        "updated description"
      );

      await waitFor(() => {
        fireEvent.click(container.getByTestId("modalOk"));
      });

      await changeInputValue(container.getByTestId, "name", "updated name");

      mockedUpdateListUseCase.execute.mockResolvedValue({ id: 2 });

      await waitFor(() => {
        fireEvent.click(container.getByTestId("submit"));
      });

      expect(mockedUpdateListUseCase.execute).toHaveBeenCalled();
      const items = [
        new ListItem({
          id: 6,
          listId: 2,
          title: "updated title",
          description: "updated description",
        }),
        new ListItem({
          id: -1,
          listId: 2,
          title: "the title",
          description: "the description",
        }),
      ];
      const list = new List({
        id: 2,
        name: "updated name",
        categoryId: 2,
        items,
      });

      expect(mockedUpdateListUseCase.execute.mock.calls[0][0]).toStrictEqual(
        list
      );
    });

    it("should allow to delete an existing item", async () => {
      const { getByTestId } = renderWithContextAndRouterForExistingList();

      await waitFor(() => {
        fireEvent.click(getByTestId("deleteListItem5"));
      });

      mockedUpdateListUseCase.execute.mockResolvedValue({ id: 2 });

      await waitFor(() => {
        fireEvent.click(getByTestId("submit"));
      });

      expect(mockedUpdateListUseCase.execute).toHaveBeenCalled();

      const list = new List({
        id: 2,
        name: "list name",
        categoryId: 1,
        items: [
          new ListItem({
            id: 6,
            title: "item 6 title",
            description: "item 6 description",
            listId: 2,
          }),
        ]
      });

      expect(mockedUpdateListUseCase.execute.mock.calls[0][0]).toStrictEqual(
        list
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
      let fragment;
      await act(async () => {
        const { asFragment } = renderWithContextAndRouterForNewList();
        fragment = asFragment;
      });
  
      expect(fragment()).toMatchSnapshot();
    });

    it("should allow to cancel", async () => {
      const { getByTestId } = renderWithContextAndRouterForNewList();

      await waitFor(() => {
        fireEvent.click(getByTestId("cancel"));
      });

      expect(mockHistoryPush).toHaveBeenCalled();
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

      await waitFor(() => {
        fireEvent.click(getByTestId("addNew"));
      });

      await changeInputValue(getByTestId, "title", "the title");
      await changeInputValue(getByTestId, "description", "the description");
      await changeInputValue(getByTestId, "categoryId", "1");

      await waitFor(() => {
        fireEvent.click(getByTestId("modalOk"));
      });

      mockedCreateListUseCase.execute.mockResolvedValue({ id: 55 });

      await waitFor(() => {
        fireEvent.click(getByTestId("submit"));
      });

      const list = new List({
        id: -1,
        name: "new list",
        categoryId: 1,
        itemsCount: 0,
        items: [
          new ListItem({
            id: -1,
            listId: -1,
            title: "the title",
            description: "the description",
          }),
        ],
      });

      expect(mockedCreateListUseCase.execute).toHaveBeenCalled();
      expect(mockedCreateListUseCase.execute.mock.calls[0][0]).toStrictEqual(
        list
      );

      expect(mockHistoryPush).toHaveBeenCalled();
      expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/55");
      mockHistoryPush.mockClear();
    });
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
