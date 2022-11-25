import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { DeleteListPage } from "./DeleteListPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { GetListByIdUseCase } from "../../../application/lists";
import { List } from "../../../domain";

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

const mockedDeleteListByIdUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) =>
    useCase == GetListByIdUseCase
      ? mockedGetListByIdUseCase
      : mockedDeleteListByIdUseCase,
};

const renderWithContextAndRouter = () => {
  mockedGetListByIdUseCase.execute.mockResolvedValue(
    new List({ id: 2, name: "ListName" })
  );
  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/delete`]}>
          <Route path="/lists/:listId/delete">{<DeleteListPage />}</Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouter();
    fragment = asFragment;
  });
  expect(fragment()).toMatchSnapshot();
});

it("should cancel the deletion", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter();
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("no"));
  });

  expect(mockHistoryGoBack).toHaveBeenCalled();
  mockHistoryGoBack.mockClear();
});

it("should delete the List", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter();
  });

  mockedDeleteListByIdUseCase.execute.mockResolvedValue(true);

  await waitFor(() => {
    fireEvent.click(container.getByTestId("yes"));
  });

  expect(mockedDeleteListByIdUseCase.execute).toHaveBeenCalled();
  expect(mockedDeleteListByIdUseCase.execute.mock.calls[0][0]).toBe("2");
  expect(mockHistoryPush).toHaveBeenCalled();
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists");
  mockHistoryPush.mockClear();
});
