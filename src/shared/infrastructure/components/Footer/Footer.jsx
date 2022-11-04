import React from "react";

export const Footer = () => {
  const parsedSha = () => {
    return process.env.REACT_APP_COMMIT_SHA?.substring(0, 7);
  }

  return (
    <footer className="footer py-1">
      <div className="content has-text-right">
        <span className="is-size-7">{`sha: ${parsedSha()}, build: ${process.env.REACT_APP_BUILD_DATE}`}</span>
      </div>
    </footer>
  );
};
