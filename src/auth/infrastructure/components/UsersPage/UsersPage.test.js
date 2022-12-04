import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { UsersPage } from "./UsersPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { User } from "../../../domain";

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
  const fakeGetUsersUseCase = {
    execute: () => [
      new User({ id: 1, name: "user1", isAdmin: true }),
      new User({ id: 2, name: "user2", isAdmin: false }),
    ],
  };

  const useCaseFactory = {
    get: () => fakeGetUsersUseCase,
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <Router history={history}>{<UsersPage />}</Router>
      </AppContext.Provider>
    ),
  };
};

describe("UsersPage", () => {
  it("should match the snapshot", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouter();
      fragment = asFragment;
    });

    expect(fragment()).toMatchSnapshot();
  });

  it("should add a new user", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouter();
    });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("addNew"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("users/new");
    mockHistoryPush.mockClear();
  });

  it("should edit the user", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouter();
    });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("editUser2"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/users/2/edit");
    mockHistoryPush.mockClear();
  });

  it("should delete the user", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouter();
    });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("deleteUser2"));
    });

    expect(history.location.pathname).toBe("/users/2/delete");
  });
});
