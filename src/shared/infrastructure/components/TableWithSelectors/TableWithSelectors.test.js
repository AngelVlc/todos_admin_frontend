import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { TableWithSelectors } from "./TableWithSelectors";
import { act } from "react-dom/test-utils";

describe("TableWithSelectors", () => {
  const rows = [
    { col1: "11", col2: "12", col3: "13", selected: false },
    { col1: "21", col2: "22", col3: "23", selected: false },
  ];

  const changeSelected = jest.fn();

  const renderComponent = (rows) => {
    return {
      ...render(
        <TableWithSelectors
          columns={[
            { name: "col1", title: "Col 1" },
            { name: "col2", title: "Col 2" },
            { name: "col3", title: "Col 3" },
          ]}
          rows={rows}
          idColumnName={"col1"}
          selectedColumnName={"selected"}
          paginationInfo={{
            pageNumner: 1,
            pageSize: 10,
            sortColumn: "col1",
            sortOrder: "asc",
          }}
          changeSelected={changeSelected}
        />
      ),
    };
  };

  afterEach(cleanup);

  it("should match the snapshot", async () => {
    const { asFragment } = renderComponent(rows);

    expect(asFragment(<TableWithSelectors />)).toMatchSnapshot();
  });

  it("should select and unselect all the rows", async () => {
    let container;
    await act(async () => {
      container = renderComponent(rows);
    });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("toggleSelectAll"));
    });

    expect(changeSelected.mock.calls.length).toBe(1);
    expect(changeSelected.mock.calls[0][0]).toStrictEqual([
      { col1: "11", col2: "12", col3: "13", selected: true },
      { col1: "21", col2: "22", col3: "23", selected: true },
    ]);

    changeSelected.mockClear();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("toggleSelectAll"));
    });

    expect(changeSelected.mock.calls.length).toBe(1);
    expect(changeSelected.mock.calls[0][0]).toStrictEqual([
      { col1: "11", col2: "12", col3: "13", selected: false },
      { col1: "21", col2: "22", col3: "23", selected: false },
    ]);
  });

  it("should select a single row", async () => {
    let container;
    await act(async () => {
      container = renderComponent(rows);
    });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("checkBoxItem11"));
    });

    expect(changeSelected.mock.calls.length).toBe(1);
    expect(changeSelected.mock.calls[0][0]).toStrictEqual([
      { col1: "11", col2: "12", col3: "13", selected: true },
      { col1: "21", col2: "22", col3: "23", selected: false },
    ]);
  });
});
