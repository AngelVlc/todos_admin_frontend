import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { EditUserPage } from "./EditUserPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { User } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouterForExistingUser = (isAdmin) => {
  const mockedGetUserByIdUseCase = {
    execute: jest.fn(),
  };

  const useCaseFactory = {
    get: () => {
      return mockedGetUserByIdUseCase;
    },
  };

  mockedGetUserByIdUseCase.execute.mockResolvedValue(
    new User({ id: 2, name: "user", isAdmin: isAdmin })
  );

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/users/2/edit`]}>
          <Route path="/users/:userId/edit">{<EditUserPage />}</Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot for an existing non admin user", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouterForExistingUser(false);
    fragment = asFragment;
  });
  expect(fragment()).toMatchSnapshot();
});

it("should match the snapshot for an existing admin user", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouterForExistingUser(true);
    fragment = asFragment;
  });
  expect(fragment()).toMatchSnapshot();
});

it("should allow delete an existing user", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouterForExistingUser(false);
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("delete"));
  });

  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/users/2/delete");
  mockHistoryPush.mockClear();
});
