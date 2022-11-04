import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { PageSelector } from "./PageSelector";

describe("PageSelector", () => {
  const mockedChangePagination = jest.fn();

  const renderComponent = (paginationInfo) => {
    return {
      ...render(
        <PageSelector
          paginationInfo={paginationInfo}
          changePagination={mockedChangePagination}
        />
      ),
    };
  };

  afterEach(cleanup);

  it("Should match the snapshot", () => {
    const { asFragment } = renderComponent({
      pageNumber: 5,
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it("Should change the page number", async () => {
    const { getByTestId } = renderComponent({
      pageNumber: 10,
    });

    await changeInputValue(getByTestId, "pagenumber-input", 5);

    expect(mockedChangePagination.mock.calls.length).toBe(1);
    expect(mockedChangePagination.mock.calls[0][0]).toStrictEqual({
      pageNumber: 5,
    });
  });
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
