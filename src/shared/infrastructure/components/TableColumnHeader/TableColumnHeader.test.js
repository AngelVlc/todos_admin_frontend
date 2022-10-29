import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { TableColumnHeader } from "./TableColumnHeader";

describe("TableColumnHeader", () => {
  const mockedChangePagination = jest.fn();

  const renderComponent = (paginationInfo) => {
    return {
      ...render(
        <table>
          <thead>
            <tr>
              <TableColumnHeader
                column={{ name: "name", title: "Title" }}
                paginationInfo={paginationInfo}
                changePagination={mockedChangePagination}
              />
            </tr>
          </thead>
        </table>
      ),
    };
  };

  afterEach(cleanup);

  describe("Should match the snapshot", () => {
    it("when the column is not ordered", async () => {
      const { asFragment } = renderComponent({
        sortColumn: "another",
        sortOrder: "asc",
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it("when the column is ordered asc", async () => {
      const { asFragment } = renderComponent({
        sortColumn: "name",
        sortOrder: "asc",
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it("when the column is ordered desc", async () => {
      const { asFragment } = renderComponent({
        sortColumn: "name",
        sortOrder: "desc",
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("Should change the pagination", () => {
    it("when the user clicks in the header and the column is not ordered", async () => {
      const { getByTestId } = renderComponent({
        sortColumn: "another",
        sortOrder: "asc",
      });

      await waitFor(() => {
        fireEvent.click(getByTestId("header-name"));
      });

      expect(mockedChangePagination.mock.calls.length).toBe(1);
      expect(mockedChangePagination.mock.calls[0][0]).toStrictEqual({
        sortColumn: "name",
        sortOrder: "asc",
      });
    });

    it("when the user clicks in the header and the column is ordered asc", async () => {
      const { getByTestId } = renderComponent({
        sortColumn: "name",
        sortOrder: "asc",
      });

      await waitFor(() => {
        fireEvent.click(getByTestId("header-name"));
      });

      expect(mockedChangePagination.mock.calls.length).toBe(1);
      expect(mockedChangePagination.mock.calls[0][0]).toStrictEqual({
        sortColumn: "name",
        sortOrder: "desc",
      });
    });

    it("when the user clicks in the header and the column is ordered desc", async () => {
      const { getByTestId } = renderComponent({
        sortColumn: "name",
        sortOrder: "desc",
      });

      await waitFor(() => {
        fireEvent.click(getByTestId("header-name"));
      });

      expect(mockedChangePagination.mock.calls.length).toBe(1);
      expect(mockedChangePagination.mock.calls[0][0]).toStrictEqual({
        sortColumn: "name",
        sortOrder: "asc",
      });
    });
  });
});
