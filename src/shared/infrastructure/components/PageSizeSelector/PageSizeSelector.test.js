import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { PageSizeSelector } from "./PageSizeSelector";

describe("PageSizeSelector", () => {
  const mockedChangePagination = jest.fn();

  const renderComponent = (paginationInfo) => {
    return {
      ...render(
        <PageSizeSelector
          paginationInfo={paginationInfo}
          changePagination={mockedChangePagination}
        />
      ),
    };
  };

  afterEach(cleanup);

  it("Should match the snapshot", () => {
    const { asFragment } = renderComponent({
      pageSize: "10",
    });

    expect(asFragment(<PageSizeSelector />)).toMatchSnapshot();
  });

  it("Should change the page size", async () => {
    const { getByTestId } = renderComponent({
      pageSize: 10,
    });

    await waitFor(() => {
      fireEvent.change(getByTestId("pagesize-select"), {
        target: { value: 20 },
      });
    });

    expect(mockedChangePagination.mock.calls.length).toBe(1);
    expect(mockedChangePagination.mock.calls[0][0]).toStrictEqual({
      pageSize: "20",
    });
  });
});
