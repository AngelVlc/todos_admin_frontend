import { render, cleanup } from "@testing-library/react";
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

const renderWithContextAndRouterForExistingUser = (component, isAdmin) => {
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
          <Route path="/users/:userId/edit">{component}</Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot for an existing non admin user", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouterForExistingUser(
      <EditUserPage />,
      false
    );
    fragment = asFragment;
  });
  expect(fragment(<EditUserPage />)).toMatchSnapshot();
});

it("should match the snapshot for an existing admin user", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouterForExistingUser(
      <EditUserPage />,
      true
    );
    fragment = asFragment;
  });
  expect(fragment(<EditUserPage />)).toMatchSnapshot();
});
