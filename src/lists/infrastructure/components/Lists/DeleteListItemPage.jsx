import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import {
  GetListItemByIdUseCase,
  DeleteListItemByIdUseCase,
} from "../../../application/listItems";

export const DeleteListItemPage = () => {
  const [item, setItem] = useState(null);
  const { useCaseFactory } = useContext(AppContext);
  let { listId, itemId } = useParams();
  let history = useHistory();

  const getListItem = useCallback(async () => {
    const getListItemByIdUseCase = useCaseFactory.get(GetListItemByIdUseCase);
    const listItem = await getListItemByIdUseCase.execute(listId, itemId);

    setItem(listItem);
  }, [listId, itemId, useCaseFactory]);

  useEffect(() => {
    getListItem();
  }, [listId, getListItem]);

  const deleteListItem = async () => {
    const deleteListItemByIdUseCase = useCaseFactory.get(
      DeleteListItemByIdUseCase
    );
    if (await deleteListItemByIdUseCase.execute(listId, itemId)) {
      history.push(`/lists/${listId}/edit`);
    }
  };

  return (
    <>
      {item && (
        <div className="container">
          <h3 className="title">{`Delete list item ${item.title}`}</h3>
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
              <li>
                <Link to={`/lists/${listId}/items/${itemId}/edit`}>
                  {item.title}
                </Link>
              </li>
              <li className="is-active">
                <Link
                  aria-current="page"
                  to={`/lists/${listId}/items/${itemId}/delete`}
                >{`Delete ${item.title}`}</Link>
              </li>
            </ul>
          </nav>
          <div className="buttons">
            <button
              className="button is-danger"
              data-testid="yes"
              onClick={() => deleteListItem()}
            >
              YES
            </button>
            <button
              className="button"
              data-testid="no"
              onClick={() => history.goBack()}
            >
              NO
            </button>
          </div>
        </div>
      )}
    </>
  );
};
