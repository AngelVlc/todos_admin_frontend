import { render, cleanup } from "@testing-library/react";
import { EditListItemPage } from "./EditListItemPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { ListItem } from "../../../domain";

jest.mock("axios");
const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouterForExistingItem = () => {
  const mockedGetListItemByIdUseCase = {
    execute: jest.fn(),
  };

  const useCaseFactory = {
    get: () => {
      return mockedGetListItemByIdUseCase;
    },
  };

  mockedGetListItemByIdUseCase.execute.mockResolvedValue(
    new ListItem({
      id: 2,
      title: "item title",
      description: "item description",
    })
  );

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
          <Route path="/lists/:listId/items/:itemId/edit">
            <EditListItemPage />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot for an existing item", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouterForExistingItem();
    fragment = asFragment;
  });
  expect(fragment()).toMatchSnapshot();
});
