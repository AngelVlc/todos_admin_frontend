import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ListItemForm } from "./ListItemForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListItemByIdUseCase } from "../../../application/listItems";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb/Breadcrumb";

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
      <Breadcrumb
        items={[
          { url: "/lists", text: "Lists" },
          { url: `/lists/${listId}`, text: "List" },
          {
            url: `/lists/${listId}/items/${itemId}/edit`,
            text: pageState.title,
          },
        ]}
      />
      <h3 className="title">{`Edit item '${pageState.title}'`}</h3>
      <ListItemForm listItem={pageState} />
    </div>
  );
};
