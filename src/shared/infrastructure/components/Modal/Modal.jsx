import React, { useRef, forwardRef, useImperativeHandle } from "react";

export const Modal = forwardRef((props, ref) => {
  const modalRef = useRef();

  useImperativeHandle(ref, () => ({
    showModal() {
      toggleIsActive();
    },
    closeModal() {
      toggleIsActive();
    },
  }));

  const onCancel = () => {
    toggleIsActive();
  };

  const onOk = () => {
    props.closeHandler();
  };

  const toggleIsActive = () => {
    modalRef.current.classList.toggle("is-active");
  };

  return (
    <div ref={modalRef} className="modal" data-testid="modal">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <div className="content">{props.children}</div>
          <div className="field is-grouped is-justify-content-center">
            {props.showOk && (
              <div className="control">
                <button
                  className="button"
                  onClick={() => onOk()}
                  data-testid="modalOk"
                >
                  OK
                </button>
              </div>
            )}
            <div className="control">
              <button
                className="button"
                onClick={() => onCancel()}
                data-testid="modalCancel"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        data-testid="modalClose"
        onClick={() => onCancel()}
      ></button>
    </div>
  );
});
