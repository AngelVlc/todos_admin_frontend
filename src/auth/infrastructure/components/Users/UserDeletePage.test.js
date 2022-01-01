import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { UserDeletePage } from "./UserDeletePage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { User } from "../../../domain";
import { GetUserByIdUseCase } from "../../../application/users";

jest.mock("axios");
const mockHistoryGoBack = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    push: mockHistoryPush,
  }),
}));

const mockedGetUserByIdUseCase = {
  execute: jest.fn(),
};

const mockedDeleteUserByIdUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) => {
    if (useCase == GetUserByIdUseCase) {
      return mockedGetUserByIdUseCase;
    }

    return mockedDeleteUserByIdUseCase;
  },
};

const renderWithContextAndRouter = (component, isAdmin) => {
  mockedGetUserByIdUseCase.execute.mockResolvedValue(
    new User({ id: 2, name: "user", isAdmin: isAdmin })
  );

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/users/2/delete`]}>
          <Route path="/users/:userId/delete">{component}</Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot when the user is not an admin", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouter(
      <UserDeletePage />,
      false
    );
    fragment = asFragment;
  });
  expect(fragment(<UserDeletePage />)).toMatchSnapshot();
});

it("should match the snapshot when the user is an admin", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouter(<UserDeletePage />, true);
    fragment = asFragment;
  });
  expect(fragment(<UserDeletePage />)).toMatchSnapshot();
});

it("should cancel the deletion", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<UserDeletePage />, false);
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("no"));
  });

  expect(mockHistoryGoBack.mock.calls.length).toBe(1);
  mockHistoryGoBack.mockClear();
});

it("should delete a user", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<UserDeletePage />, false);
  });

  mockedDeleteUserByIdUseCase.execute.mockResolvedValue(true);

  await waitFor(() => {
    fireEvent.click(container.getByTestId("yes"));
  });

  expect(mockedDeleteUserByIdUseCase.execute.mock.calls.length).toBe(1);
  expect(mockedDeleteUserByIdUseCase.execute.mock.calls[0][0]).toBe("2");
  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
  mockHistoryPush.mockClear();
});
