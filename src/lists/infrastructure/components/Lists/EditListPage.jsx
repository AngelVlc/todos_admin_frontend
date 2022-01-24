import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ListForm } from "./ListForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase } from "../../../application/lists";
import { GetListItemsUseCase } from "../../../application/listItems";
import { List } from "../../../domain";

export const EditListPage = () => {
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
      <h3 className="title">{`Edit list '${pageState.name}'`}</h3>
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
      <ListForm list={pageState} />
    </div>
  );
};
