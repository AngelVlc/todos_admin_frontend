import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { ListItemForm } from "./ListItemForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { ListItem } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const itemFormRef = React.createRef();

// const onSubmit = jest.fn();
const onSubmit = () => { console.log("########### on Submit") }

const renderWithContextAndRouterForExistingItem = () => {
  const context = { auth: { info: {} } };

  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
          <Route path="/lists/:listId/items/:itemId/edit">
            <ListItemForm ref={itemFormRef} onSubmit={onSubmit} />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

const renderWithContextAndRouterForNewItem = () => {
  const context = { auth: { info: {} } };

  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/items/new`]}>
          <Route path="/lists/:listId/items/new">
            <ListItemForm ref={itemFormRef} onSubmit={onSubmit} />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("ListItemForm", () => {
  it("should match the snapshot for an existing item", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouterForExistingItem();
      fragment = asFragment;

      itemFormRef.current.setValues(
        new ListItem({
          id: 5,
          title: "item title",
          description: "item description",
        })
      );
    });

    expect(fragment()).toMatchSnapshot();
  });

  it("should match the snapshot for a new item", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouterForNewItem();
      fragment = asFragment;

      itemFormRef.current.setValues(ListItem.createEmpty(-1));
    });

    expect(fragment()).toMatchSnapshot();
  });

  it("should require item title", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouterForExistingItem();
      itemFormRef.current.setValues(
        new ListItem({
          id: 5,
          title: '',
          description: "item description",
        })
      );
    });

    await waitFor(() => {
      itemFormRef.current.submitForm()
    });

    expect(container.getByTestId("titleErrors")).toHaveTextContent("Required");
  });
});
