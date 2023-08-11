import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { DeleteUserPage } from "./DeleteUserPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { User } from "../../../domain";
import { GetUserByIdUseCase } from "../../../application/users";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockedDeleteUserByIdUseCase = {
  execute: jest.fn(),
};

const renderWithContextAndRouter = (isAdmin) => {
  const fakeGetUserByIdUseCase = {
    execute: () => new User({ id: 2, name: "user", isAdmin: isAdmin }),
  };

  const useCaseFactory = {
    get: (useCase) =>
      useCase == GetUserByIdUseCase
        ? fakeGetUserByIdUseCase
        : mockedDeleteUserByIdUseCase,
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/users/2/delete`]}>
          <Route path="/users/:userId/delete">{<DeleteUserPage />}</Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("DeleteUserPage", () => {
  describe("when the user is not an admin", () => {
    it("should match the snapshot when the user is not an admin", async () => {
      let fragment;
      await act(async () => {
        const { asFragment } = renderWithContextAndRouter(false);
        fragment = asFragment;
      });

      expect(fragment()).toMatchSnapshot();
    });

    it("when click on cancel should cancel the deletion", async () => {
      let container;
      await act(async () => {
        container = renderWithContextAndRouter(false);
      });

      await waitFor(() => {
        fireEvent.click(container.getByTestId("no"));
      });

      expect(mockHistoryPush).toHaveBeenCalled();
      expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
      mockHistoryPush.mockClear();
    });

    it("when click on yes should delete a user", async () => {
      let container;
      await act(async () => {
        container = renderWithContextAndRouter(false);
      });

      mockedDeleteUserByIdUseCase.execute.mockResolvedValue(true);

      await waitFor(() => {
        fireEvent.click(container.getByTestId("yes"));
      });

      expect(mockedDeleteUserByIdUseCase.execute).toHaveBeenCalled();
      expect(mockedDeleteUserByIdUseCase.execute.mock.calls[0][0]).toBe("2");
      expect(mockHistoryPush).toHaveBeenCalled();
      expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
      mockHistoryPush.mockClear();
    });
  });

  describe("when the user is an admin", () => {
    it("should match the snapshot when the user is an admin", async () => {
      let fragment;
      await act(async () => {
        const { asFragment } = renderWithContextAndRouter(true);
        fragment = asFragment;
      });

      expect(fragment()).toMatchSnapshot();
    });
  });
});
