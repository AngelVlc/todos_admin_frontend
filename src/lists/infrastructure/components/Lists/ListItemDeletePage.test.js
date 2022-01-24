import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { ListItemDeletePage } from "./ListItemDeletePage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { GetListItemByIdUseCase } from "../../../application/listItems";
import { ListItem } from "../../../domain";

const mockHistoryGoBack = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    push: mockHistoryPush,
  }),
}));

const mockedGetListItemByIdUseCase = {
  execute: jest.fn(),
};

const mockedDeleteListItemByIdUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) => {
    if (useCase == GetListItemByIdUseCase) {
      return mockedGetListItemByIdUseCase;
    }

    return mockedDeleteListItemByIdUseCase;
  },
};

const renderWithContextAndRouter = (component) => {
  mockedGetListItemByIdUseCase.execute.mockResolvedValue(
    new ListItem({ id: 2, title: "item title", description: "item desc" })
  );

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/items/5/delete`]}>
          <Route path="/lists/:listId/items/:itemId/delete">{component}</Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouter(<ListItemDeletePage />);
    fragment = asFragment;
  });
  expect(fragment(<ListItemDeletePage />)).toMatchSnapshot();
});

it("should cancel the deletion", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<ListItemDeletePage />);
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("no"));
  });

  expect(mockHistoryGoBack.mock.calls.length).toBe(1);
  mockHistoryGoBack.mockClear();
});

it("should delete the List", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<ListItemDeletePage />);
  });

  mockedDeleteListItemByIdUseCase.execute.mockResolvedValue(true);

  await waitFor(() => {
    fireEvent.click(container.getByTestId("yes"));
  });

  expect(mockedDeleteListItemByIdUseCase.execute.mock.calls.length).toBe(1);
  expect(mockedDeleteListItemByIdUseCase.execute.mock.calls[0][0]).toBe("2");
  expect(mockedDeleteListItemByIdUseCase.execute.mock.calls[0][1]).toBe("5");
  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/2/edit");
  mockHistoryPush.mockClear();
});
