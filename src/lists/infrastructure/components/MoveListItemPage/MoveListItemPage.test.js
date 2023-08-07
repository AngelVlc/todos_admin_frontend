import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { MoveListItemPage } from "./MoveListItemPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { List } from "../../../domain";
import { GetListByIdUseCase, GetListsUseCase, MoveListItemUseCase } from "../../../application/lists";

const mockHistoryGoBack = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    push: mockHistoryPush,
  }),
}));

const mockedGetListByIdUseCase = {
  execute: jest.fn(),
};

const mockedGetListsUseCase = {
  execute: jest.fn(),
};

const mockedMoveListItemUseCase = {
  execute: jest.fn(),
};

const renderWithContextAndRouter = () => {
  mockedGetListByIdUseCase.execute.mockResolvedValue(
    new List({ id: 2, name: "ListName", items: [{ id: 5, title: "title" }] })
  );
  mockedGetListsUseCase.execute.mockResolvedValue([
    new List({ id: 20, name: "Another list", itemsCount: 2 }),
    new List({ id: 30, name: "Another more", itemsCount: 3 }),
  ]);

  const useCaseFactory = {
    get: (useCase) => {
      switch (useCase) {
        case GetListByIdUseCase:
          return mockedGetListByIdUseCase;
        case GetListsUseCase:
          return mockedGetListsUseCase;
        case MoveListItemUseCase:
          return mockedMoveListItemUseCase
      }
    },
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/move-item/5`]}>
          <Route path="/lists/:listId/move-item/:listItemId">{<MoveListItemPage />}</Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("MoveListItemPage", () => {
  it("should match the snapshot", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouter();
      fragment = asFragment;
    });

    expect(fragment()).toMatchSnapshot();
  });

  it("when click on cancel should cancel the deletion", async () => {
    const container = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("no"));
    });

    expect(mockHistoryGoBack).toHaveBeenCalled();
    mockHistoryGoBack.mockClear();
  });

  it("when click on yes should move the list item", async () => {
    const container = renderWithContextAndRouter();

    mockedMoveListItemUseCase.execute.mockResolvedValue(true);

    await waitFor(() => {
      fireEvent.click(container.getByTestId("radio-30"));
    });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("yes"));
    });

    expect(mockedMoveListItemUseCase.execute).toHaveBeenCalled();
    console.log("#######", mockedMoveListItemUseCase.execute.mock.calls[0])
    expect(mockedMoveListItemUseCase.execute.mock.calls[0][0]).toBe(2);
    expect(mockedMoveListItemUseCase.execute.mock.calls[0][1]).toBe(5);
    expect(mockedMoveListItemUseCase.execute.mock.calls[0][2]).toBe(30);
    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/2");
    mockHistoryPush.mockClear();
  });
});