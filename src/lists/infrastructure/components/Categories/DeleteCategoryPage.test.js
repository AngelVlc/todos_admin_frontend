import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { DeleteCategoryPage } from "./DeleteCategoryPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { GetCategoryByIdUseCase } from "../../../application";
import { Category } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockedGetCategoryByIdUseCase = {
  execute: jest.fn(),
};

const mockedDeleteCategoryByIdUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) =>
    useCase == GetCategoryByIdUseCase
      ? mockedGetCategoryByIdUseCase
      : mockedDeleteCategoryByIdUseCase,
};

const renderWithContextAndRouter = () => {
  mockedGetCategoryByIdUseCase.execute.mockResolvedValue(
    new Category({ id: 2, name: "category name" })
  );
  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/categories/2/delete`]}>
          <Route path="/categories/:categoryId/delete"><DeleteCategoryPage /></Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("DeleteCategoryPage", () => {
  it("should match the snapshot", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouter();
      fragment = asFragment;
    });

    expect(fragment()).toMatchSnapshot();
  });

  it("when click on cancel should cancel the deletion", async () => {
    const container = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("no"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/categories");
    mockHistoryPush.mockClear();
  });

  it("when click on yes should delete the Category", async () => {
    const container = renderWithContextAndRouter();

    mockedDeleteCategoryByIdUseCase.execute.mockResolvedValue(true);

    await waitFor(() => {
      fireEvent.click(container.getByTestId("yes"));
    });

    expect(mockedDeleteCategoryByIdUseCase.execute).toHaveBeenCalled();
    expect(mockedDeleteCategoryByIdUseCase.execute.mock.calls[0][0]).toBe("2");
    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/categories");
    mockHistoryPush.mockClear();
  });
});
