import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { ListsPage } from "./ListsPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { List } from "../../../domain";
import { GetListsUseCase, GetSearchSecureKeyUseCase, GetCategoriesUseCase } from "../../../application";

afterEach(cleanup);

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const history = createMemoryHistory();

const renderWithContextAndRouter = () => {
  const fakeGetListsUseCase = {
    execute: () => [
      new List({ id: 1, name: "list1", categoryId: 1, itemsCount: 4 }),
      new List({ id: 2, name: "list2", categoryId: null, itemsCount: 6 }),
    ],
  };

  const fakeGetSearchSecureKeyUseCase = {
    execute: () => "",
  };

  const fakeGetCategoriesUseCase = {
    execute: () => [
      { id: 1, name: "category1" },
      { id: 2, name: "category2" },
    ],
  };

  const useCaseFactory = {
    get: (useCase) => {
      switch(useCase) {
        case GetListsUseCase:
          return fakeGetListsUseCase;
        case GetSearchSecureKeyUseCase:
          return fakeGetSearchSecureKeyUseCase;
        case GetCategoriesUseCase:
          return fakeGetCategoriesUseCase;
      };
    },
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <Router history={history}>
          <ListsPage />
        </Router>
      </AppContext.Provider>
    ),
  };
};

describe("ListsPage", () => {
  it("should match the snapshot", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouter();
      fragment = asFragment;
    });

    expect(fragment()).toMatchSnapshot();
  });

  it("should add a new list", async () => {
    const container = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("addNew"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/new");
    mockHistoryPush.mockClear();
  });

  it("should view the list", async () => {
    const container = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("viewList2"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/2");
    mockHistoryPush.mockClear();
  });

  it("should delete the list", async () => {
    const container = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("deleteList2"));
    });

    expect(history.location.pathname).toBe("/lists/2/delete");
  });
});
