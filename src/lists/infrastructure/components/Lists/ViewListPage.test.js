import { render, cleanup } from "@testing-library/react";
import { ViewListPage } from "./ViewListPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { List, ListItem } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouter = () => {
  const mockedGetListByIdWithItemsUseCase = {
    execute: jest.fn(),
  };

  const useCaseFactory = {
    get: () => {
      return mockedGetListByIdWithItemsUseCase;
    },
  };

  const list = new List({ id: 2, name: "list name" });
  list.items = [
    new ListItem({
      id: 5,
      title: "item title",
      description: "item description",
    }),
  ];

  mockedGetListByIdWithItemsUseCase.execute.mockResolvedValue(list);

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
