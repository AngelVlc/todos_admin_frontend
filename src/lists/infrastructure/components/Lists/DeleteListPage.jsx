import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import {
  GetListByIdUseCase,
  DeleteListByIdUseCase,
} from "../../../application/lists";

export const DeleteListPage = () => {
  const [list, setList] = useState(null);
  const { useCaseFactory } = useContext(AppContext);
  let { listId } = useParams();
  let history = useHistory();

  const getList = useCallback(async () => {
    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    setList(list);
  }, [listId, useCaseFactory]);

  useEffect(() => {
    getList();
  }, [listId, getList]);

  const deleteList = async () => {
    const deleteListByIdUseCase = useCaseFactory.get(DeleteListByIdUseCase);

    if (await deleteListByIdUseCase.execute(listId)) {
      history.push("/lists");
    }
  };

  return (
    <>
      {list && (
        <div className="container">
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
                  to={`/lists/${listId}/delete`}
                >{`Delete ${list.name}`}</Link>
              </li>
            </ul>
          </nav>
          <h3 className="title">{`Delete list ${list.name}`}</h3>
          <div className="buttons">
            <button
              className="button is-danger"
              data-testid="yes"
              onClick={() => deleteList()}
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
