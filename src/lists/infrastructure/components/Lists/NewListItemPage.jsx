import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { ListItemForm } from "./ListItemForm";
import { ListItem } from "../../../domain";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase } from "../../../application/lists";

export const NewListItemPage = () => {
  let { listId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState();

  const getExistingItem = useCallback(async () => {
    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    setPageState(list);
  }, [listId, useCaseFactory]);

  useEffect(() => {
    getExistingItem();
  }, [listId, getExistingItem]);

  return (
    <>
      {pageState && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              { url: `/lists/${listId}`, text: pageState.name },
              { url: `/lists/${listId}/items/new`, text: "New" },
            ]}
          />
          <h3 className="title">New item</h3>
          <ListItemForm listItem={ListItem.createEmpty(listId)} />
        </div>
      )}
    </>
  );
};
