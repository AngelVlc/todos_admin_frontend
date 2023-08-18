import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { Modal } from "./Modal";
import { act } from "react-dom/test-utils";

const modalRef = React.createRef();

const mockedOnModalClose = jest.fn();

const renderModal = () => {
  return {
    ...render(
      <Modal ref={modalRef} closeHandler={mockedOnModalClose} showOk={true}>
        <p>Modal content</p>
      </Modal>
    ),
  };
};

afterEach(cleanup);

describe("Modal", () => {
  describe("When the modal is hidden", () => {
    it("should match the snapshot", async () => {
      let fragment;
      await act(async () => {
        const { asFragment } = renderModal();
        fragment = asFragment;
      });

      expect(fragment()).toMatchSnapshot();
    });
  });

  describe("When the modal is visible", () => {
    it("should match the snapshot", async () => {
      let fragment;
      await act(async () => {
        const { asFragment } = renderModal();
        fragment = asFragment;

        modalRef.current.showModal();
      });

      expect(fragment()).toMatchSnapshot();
    });
  });

  describe("Close button", () => {
    it("should close the modal without triggering the close handler", async () => {
      let container;
      await act(async () => {
        container = renderModal();

        modalRef.current.showModal();
      });

      await waitFor(() => {
        fireEvent.click(container.getByTestId("modalClose"));
      });

      expect(mockedOnModalClose).not.toHaveBeenCalled();
    });
  });

  describe("Close button", () => {
    it("should close the modal without triggering the close handler", async () => {
      let container;
      await act(async () => {
        container = renderModal();

        modalRef.current.showModal();
      });

      await waitFor(() => {
        fireEvent.click(container.getByTestId("modalClose"));
      });

      expect(mockedOnModalClose).not.toHaveBeenCalled();
    });
  });

  describe("Cancel button", () => {
    it("should close the modal without triggering the close handler", async () => {
      let container;
      await act(async () => {
        container = renderModal();

        modalRef.current.showModal();
      });

      await waitFor(() => {
        fireEvent.click(container.getByTestId("modalCancel"));
      });

      expect(mockedOnModalClose).not.toHaveBeenCalled();
    });
  });

  describe("Ok button", () => {
    it("should close the modal triggering the close handler", async () => {
      let container;
      await act(async () => {
        container = renderModal();

        modalRef.current.showModal();
      });

      await waitFor(() => {
        fireEvent.click(container.getByTestId("modalOk"));
      });

      expect(mockedOnModalClose).toHaveBeenCalled();
    });
  });

  describe("ref #closeModal", () => {
    it("should close the modal", async () => {
      let container;
      await act(async () => {
        container = renderModal();

        modalRef.current.showModal();
        modalRef.current.closeModal();
      });

      expect(container.getByTestId("modal").classList.contains('is-active')).toBe(false)
    })
  });
});
