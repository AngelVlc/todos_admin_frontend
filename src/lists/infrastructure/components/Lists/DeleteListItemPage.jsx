import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase } from "../../../application/lists";
import {
  GetListItemByIdUseCase,
  DeleteListItemByIdUseCase,
} from "../../../application/listItems";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const DeleteListItemPage = () => {
  const [pageState, setPageState] = useState(null);
  const { useCaseFactory } = useContext(AppContext);
  let { listId, itemId } = useParams();
  let history = useHistory();

  const getListItem = useCallback(async () => {
    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    const getListItemByIdUseCase = useCaseFactory.get(GetListItemByIdUseCase);
    const listItem = await getListItemByIdUseCase.execute(listId, itemId);

    const data = {
      list: list,
      listItem: listItem,
    };

    setPageState(data);
  }, [listId, itemId, useCaseFactory]);

  useEffect(() => {
    getListItem();
  }, [listId, getListItem]);

  const deleteListItem = async () => {
    const deleteListItemByIdUseCase = useCaseFactory.get(
      DeleteListItemByIdUseCase
    );
    if (await deleteListItemByIdUseCase.execute(listId, itemId)) {
      history.push(`/lists/${listId}`);
    }
  };

  return (
    <>
      {pageState && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              { url:`/lists/${listId}`, text: pageState.list.name },
              { url: `/lists/${listId}/items/${itemId}/edit`, text: pageState.listItem.title },
              { url: `/lists/${listId}/items/${itemId}/delete`, text: 'Delete' },
            ]}
          />
          <h3 className="title">{`Delete list item ${pageState.listItem.title}`}</h3>
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
