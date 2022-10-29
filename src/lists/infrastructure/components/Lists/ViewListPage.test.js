import { render, cleanup } from "@testing-library/react";
import { ViewListPage } from "./ViewListPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { List, ListItem } from "../../../domain";
import { GetListByIdUseCase } from "../../../application/lists";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouter = () => {
  const mockedGetListByIdUseCase = {
    execute: jest.fn(),
  };

  const mockedGetListItemsUseCase = {
    execute: jest.fn(),
  };

  const useCaseFactory = {
    get: (useCase) => {
      if (useCase == GetListByIdUseCase) {
        return mockedGetListByIdUseCase;
      }

      return mockedGetListItemsUseCase;
    },
  };

  mockedGetListByIdUseCase.execute.mockResolvedValue(
    new List({ id: 2, name: "list name" })
  );

  mockedGetListItemsUseCase.execute.mockResolvedValue([
    new ListItem({
      id: 5,
      title: "item title",
      description: "item description",
    }),
  ]);

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/read`]}>
          <Route path="/lists/:listId/read">
            <ViewListPage />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot for an existing list", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouter();
    fragment = asFragment;
  });
  expect(fragment()).toMatchSnapshot();
});
