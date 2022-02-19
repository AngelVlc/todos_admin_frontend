import React from "react";
import "./PageSelector.css";

export const PageSelector = (props) => {
  const pageNumberChanged = (event) => {
    props.changePagination({
      ...props.paginationInfo,
      pageNumber: parseInt(event.target.value),
    });
  };

  const previousPageClicked = () => {
    props.changePagination({
      ...props.paginationInfo,
      pageNumber: props.paginationInfo.pageNumber - 1,
    });
  };

  const nextPageClicked = () => {
    props.changePagination({
      ...props.paginationInfo,
      pageNumber: props.paginationInfo.pageNumber + 1,
    });
  };

  return (
    <div className="ml-3 level-item">
      {props.paginationInfo.pageNumber > 1 && (
        <span className="icon" onClick={() => previousPageClicked()}>
          <i className="fas fa-thin fa-backward" />
        </span>
      )}
      <input
        type="number"
        min="1"
        value={props.paginationInfo.pageNumber}
        className="pageNumber"
        onChange={(e) => pageNumberChanged(e)}
        data-testid='pagenumber-input'
      ></input>
      <span className="icon" onClick={() => nextPageClicked()}>
        <i className="fas fa-thin fa-forward" />
      </span>
    </div>
  );
};
