import React from "react";
import { Link } from "react-router-dom";

export const Breadcrumb = (props) => {
  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <Link to={`/`}>Home</Link>
        </li>
        {props.items.map((item, index) => {
          const lastItem = index === props.items.length - 1;
          const classNames = lastItem ? { "className": "is-active" } : {};
          const aria = lastItem ? { "aria-current": "page" } : {};
          return (
            <li key={`item${index}`} {...classNames}>
              <Link {...aria} to={item.url}>
                {item.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
