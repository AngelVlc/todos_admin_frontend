import React from "react";
import { Link, useParams } from "react-router-dom";
import { ListItemForm } from "./ListItemForm";
import { ListItem } from "../../../domain";

export const NewListItemPage = () => {
  let { listId } = useParams();

  return (
    <div className="container">
      <h3 className="title">New item</h3>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to={`/`}>Home</Link>
          </li>
          <li>
            <Link to={`/lists`}>Lists</Link>
          </li>
          <li>
            <Link to={`/lists/${listId}/edit`}>List</Link>
          </li>
          <li className="is-active">
            <Link aria-current="page" to={`/lists/${listId}/items/new`}>
              New
            </Link>
          </li>
        </ul>
      </nav>
      <ListItemForm listItem={new ListItem({ listId })} />
    </div>
  );
};
