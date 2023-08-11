import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { IndexAllListsPage } from "./IndexAllListsPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockedIndexAllUseCase = {
  execute: jest.fn(),
};


const renderWithContextAndRouter = () => {
  const useCaseFactory = {
    get: () => mockedIndexAllUseCase,
  };

  const context = { auth: { info: {} }, useCaseFactory };

  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={['/']}>
          <Route>
            <IndexAllListsPage />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("IndexAllListsPage", () => {
  it("should match the snapshot", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouter();
      fragment = asFragment;
    });

    expect(fragment()).toMatchSnapshot();
  });

  it("when click on cancel should cancel the indexing", async () => {
    const container = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("no"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/");
    mockHistoryPush.mockClear();
  });

  it("when click on yes should index all the List", async () => {
    const container = renderWithContextAndRouter();

    mockedIndexAllUseCase.execute.mockResolvedValue(true);

    await waitFor(() => {
      fireEvent.click(container.getByTestId("yes"));
    });

    expect(mockedIndexAllUseCase.execute).toHaveBeenCalled();
    expect(mockedIndexAllUseCase.execute.mock.calls[0][0]).toBe(undefined);
    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/");
    mockHistoryPush.mockClear();
  });
});
