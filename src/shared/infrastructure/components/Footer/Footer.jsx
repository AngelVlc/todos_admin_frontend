import React from "react";

export const Footer = () => {
  return (
    <footer className="footer py-1">
      <div className="content has-text-right">
        <span className="is-size-7">{`sha: ${process.env.REACT_APP_COMMIT_SHA}, build: ${process.env.REACT_APP_BUILD_DATE}`}</span>
      </div>
    </footer>
  );
};
