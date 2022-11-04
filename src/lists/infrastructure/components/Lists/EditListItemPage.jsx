import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ListItemForm } from "./ListItemForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase } from "../../../application/lists";
import { GetListItemByIdUseCase } from "../../../application/listItems";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb/Breadcrumb";

export const EditListItemPage = () => {
  let history = useHistory();
  let { listId, itemId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState();

  const getExistingItem = useCallback(async () => {
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
    getExistingItem();
  }, [listId, itemId, getExistingItem]);

  return (
    <>
      {pageState && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              { url: `/lists/${listId}`, text: pageState.list.name },
              {
                url: `/lists/${listId}/items/${itemId}/edit`,
                text: pageState.listItem.title,
              },
            ]}
          />
          <h3 className="title">{`Edit item '${pageState.listItem.title}'`}</h3>
          <ListItemForm listItem={pageState.listItem}>
            <div className="control">
              <button
                className="button is-danger"
                data-testid="delete"
                type="button"
                onClick={() =>
                  history.push(
                    `/lists/${listId}/items/${itemId}/delete`
                  )
                }
              >
                DELETE
              </button>
            </div>
          </ListItemForm>
        </div>
      )}
    </>
  );
};
