import React, { useEffect, useState, useContext, useCallback } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase } from "../../../application/lists";
import { GetListItemsUseCase } from "../../../application/listItems";
import { List } from "../../../domain";

export const ViewListPage = () => {
  let history = useHistory();
  let { listId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState(new List({ name: "", items: [] }));

  const getExistingList = useCallback(async () => {
    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const listData = await getListByIdUseCase.execute(listId);

    const getListItemsUseCase = useCaseFactory.get(GetListItemsUseCase);
    const itemsData = await getListItemsUseCase.execute(listId);

    setPageState(new List({ ...listData, items: itemsData }));
  }, [listId, useCaseFactory]);

  useEffect(() => {
    getExistingList();
  }, [listId, getExistingList]);

  return (
    <div className="container">
      <h3 className="title">{`List '${pageState.name}'`}</h3>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to={`/`}>Home</Link>
          </li>
          <li>
            <Link to={`/lists`}>Lists</Link>
          </li>
          <li className="is-active">
            <Link aria-current="page" to={`/lists/${listId}`}>
              {pageState.name}
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        {pageState.items.map((item) => (
          <div className="mb-2" key={item.id}>
            <p>{item.title}</p>
            <p className="is-size-7">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="field is-grouped mt-4">
          <p className="control">
            <button className="button" data-testid="edit" onClick={() => history.push(`/lists/${listId}/edit`)}>
              EDIT
            </button>
          </p>
          <p className="control">
            <button
              className="button"
              data-testid="cancel"
              type="button"
              onClick={() => history.push("/lists")}
            >
              BACK
            </button>
          </p>
        </div>
    </div>
  );
};
