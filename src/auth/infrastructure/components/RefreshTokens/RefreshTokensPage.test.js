import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { RefreshTokensPage } from "./RefreshTokensPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { GetRefreshTokensUseCase } from "../../../application/refreshTokens";
import { RefreshToken } from "../../../domain";

afterEach(cleanup);

const history = createMemoryHistory();

const refreshTokens = [
  new RefreshToken({
    id: 1,
    userId: 1,
    expirationDate: "2021-01-29T16:46:58Z",
  }),
  new RefreshToken({
    id: 2,
    userId: 2,
    expirationDate: "2021-03-29T16:46:58Z",
  }),
  new RefreshToken({
    id: 3,
    userId: 1,
    expirationDate: "2021-04-29T16:46:58Z",
  }),
];

const mockedGetRefreshTokensUseCase = {
  execute: () => refreshTokens,
};

const mockedDeleteRefreshTokensByIdUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) => {
    if (useCase == GetRefreshTokensUseCase) {
      return mockedGetRefreshTokensUseCase;
    }

    return mockedDeleteRefreshTokensByIdUseCase;
  },
};

const renderWithContextAndRouter = (component) => {
  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <Router history={history}>{component}</Router>
      </AppContext.Provider>
    ),
  };
};

it("should match the snapshot", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouter(<RefreshTokensPage />);
    fragment = asFragment;
  });
  expect(fragment(<RefreshTokensPage />)).toMatchSnapshot();
});

it("should select all the refresh tokens", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<RefreshTokensPage />);
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("toggleSelectAll"));

    expect(container.getByTestId("checkBoxItem1")).toBeChecked();
    expect(container.getByTestId("checkBoxItem2")).toBeChecked();
    expect(container.getByTestId("checkBoxItem3")).toBeChecked();
  });
});

it("should unselect all the refresh tokens", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<RefreshTokensPage />);
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("toggleSelectAll"));
    fireEvent.click(container.getByTestId("checkBoxItem1"));
    fireEvent.click(container.getByTestId("checkBoxItem2"));
    fireEvent.click(container.getByTestId("checkBoxItem3"));

    expect(container.getByTestId("checkBoxItem1")).not.toBeChecked();
    expect(container.getByTestId("checkBoxItem2")).not.toBeChecked();
    expect(container.getByTestId("checkBoxItem3")).not.toBeChecked();
  });
});

it("should unselect all the refresh tokens", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<RefreshTokensPage />);
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("checkBoxItem1"));
    fireEvent.click(container.getByTestId("checkBoxItem3"));
  });

  mockedDeleteRefreshTokensByIdUseCase.execute.mockResolvedValue(true);

  mockedGetRefreshTokensUseCase.execute = () => [
    new RefreshToken({
      id: 2,
      userId: 2,
      expirationDate: "2021-03-29T16:46:58Z",
    }),
  ];

  const cbItem1 = container.getByTestId("checkBoxItem1");
  const cbItem3 = container.getByTestId("checkBoxItem3");

  await waitFor(() => {
    fireEvent.click(container.getByTestId("deleteSelected"));
  });

  expect(mockedDeleteRefreshTokensByIdUseCase.execute.mock.calls.length).toBe(
    1
  );
  expect(
    mockedDeleteRefreshTokensByIdUseCase.execute.mock.calls[0][0]
  ).toStrictEqual(refreshTokens);
  expect(cbItem1).not.toBeInTheDocument();
  expect(container.getByTestId("checkBoxItem2")).toBeInTheDocument();
  expect(cbItem3).not.toBeInTheDocument();
});
