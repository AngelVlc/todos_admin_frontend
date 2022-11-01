import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { UserForm } from "./UserForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { CreateUserUseCase } from "../../../application/users";
import { User } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockedCreateUserUseCase = {
  execute: jest.fn(),
};

const mockedUpdateUserUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) => {
    if (useCase == CreateUserUseCase) {
      return mockedCreateUserUseCase;
    }

    return mockedUpdateUserUseCase;
  },
};

const renderWithContextAndRouterForExistingUser = (isAdmin) => {
  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/users/2/edit`]}>
          <Route path="/users/:userId/edit">
            <UserForm user={new User({ id: 2, name: "user", isAdmin })} />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

const renderWithContextAndRouterForNewUser = () => {
  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/users/new`]}>
          <Route path="/users/new">
            <UserForm user={User.createEmpty()}/>
          </Route>
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

it("should match the snapshot for a new user", async () => {
  const { asFragment } = renderWithContextAndRouterForNewUser();
  expect(asFragment()).toMatchSnapshot();
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

it("should allow cancel", async () => {
  const { getByTestId } = renderWithContextAndRouterForNewUser();

  await waitFor(() => {
    fireEvent.click(getByTestId("cancel"));
  });

  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
  mockHistoryPush.mockClear();
});

it("should require user name", async () => {
  const { getByTestId } = renderWithContextAndRouterForNewUser();

  await waitFor(() => {
    fireEvent.click(getByTestId("submit"));
  });

  expect(getByTestId("userNameErrors")).toHaveTextContent("Required");
});

it("should update an existing user", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouterForExistingUser(false);
  });

  await changeInputValue(container.getByTestId, "name", "updated user");
  await changeInputValue(container.getByTestId, "password", "pass");
  await changeInputValue(container.getByTestId, "confirmPassword", "pass");
  await waitFor(() => {
    fireEvent.click(container.getByTestId("isAdmin"));
  });

  mockedUpdateUserUseCase.execute.mockResolvedValue({ id: 2 });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("submit"));
  });

  expect(mockedUpdateUserUseCase.execute.mock.calls.length).toBe(1);

  const user = new User({ id: 2, name: "updated user", isAdmin: true });
  user.password = "pass";
  user.confirmPassword = "pass";
  expect(mockedUpdateUserUseCase.execute.mock.calls[0][0]).toStrictEqual(user);

  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
  mockHistoryPush.mockClear();
});

it("should create a new user", async () => {
  const { getByTestId } = renderWithContextAndRouterForNewUser();

  await changeInputValue(getByTestId, "name", "new user");
  await changeInputValue(getByTestId, "password", "pass");
  await changeInputValue(getByTestId, "confirmPassword", "pass");

  mockedCreateUserUseCase.execute.mockResolvedValue({ id: 55 });

  await waitFor(() => {
    fireEvent.click(getByTestId("submit"));
  });

  expect(mockedCreateUserUseCase.execute.mock.calls.length).toBe(1);

  const user = new User({ name: "new user", isAdmin: false });
  user.password = "pass";
  user.confirmPassword = "pass";
  expect(mockedCreateUserUseCase.execute.mock.calls[0][0]).toStrictEqual(user);

  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
  mockHistoryPush.mockClear();
});

const changeInputValue = async (getByTestId, name, value) => {
  await waitFor(() => {
    fireEvent.change(getByTestId(name), {
      target: {
        value: value,
      },
    });
  });
};
