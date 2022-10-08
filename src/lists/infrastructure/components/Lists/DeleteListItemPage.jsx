import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import {
  GetListItemByIdUseCase,
  DeleteListItemByIdUseCase,
} from "../../../application/listItems";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb/Breadcrumb";

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
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              { url:`/lists/${listId}/edit`, text: "List" },
              { url: `/lists/${listId}/items/${itemId}/edit`, text: item.title },
              { url: `/lists/${listId}/items/${itemId}/delete`, text: `Delete ${item.title}` },
            ]}
          />
          <h3 className="title">{`Delete list item ${item.title}`}</h3>
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
