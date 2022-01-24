import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ListItemForm } from "./ListItemForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListItemByIdUseCase } from "../../../application/listItems";

export const EditListItemPage = () => {
  let { listId, itemId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState({ title: "" });

  const getExistingItem = useCallback(async () => {
    const getListItemByIdUseCase = useCaseFactory.get(GetListItemByIdUseCase);
    const data = await getListItemByIdUseCase.execute(listId, itemId);

    setPageState(data);
  }, [listId, itemId, useCaseFactory]);

  useEffect(() => {
    getExistingItem();
  }, [listId, itemId, getExistingItem]);

  return (
    <div className="container">
      <h3 className="title">{`Edit item '${pageState.title}'`}</h3>
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
            <Link
              aria-current="page"
              to={`/lists/${listId}/items/${itemId}/edit`}
            >
              {pageState.title}
            </Link>
          </li>
        </ul>
      </nav>
      <ListItemForm listItem={pageState} />
    </div>
  );
};
