import React, { useRef, forwardRef, useImperativeHandle } from "react";

export const Modal = forwardRef((props, ref) => {
  const modalRef = useRef();

  useImperativeHandle(ref, () => ({
    showModal() {
      toggleIsActive();
    },
    closeModal() {
      toggleIsActive();
    }
  }));

  const onCancel = () => {
    toggleIsActive();
  };

  const onOk = () => {
    props.closeHandler();
  };

  const toggleIsActive = () => {
    modalRef.current.classList.toggle("is-active");
  }

  return (
    <div ref={modalRef} className="modal">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <div className="content">{props.children}</div>
          <div className="field is-grouped is-justify-content-center">
          <div className="control">
            <button className="button" onClick={() => onOk()}>OK</button>
            </div>
            <div className="control">

            <button className="button" onClick={() => onCancel()}>CANCEL</button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={() => onCancel()}
      ></button>
    </div>
  );
});
