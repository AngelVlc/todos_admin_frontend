import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ListForm } from "./ListForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase } from "../../../application/lists";
import { GetListItemsUseCase } from "../../../application/listItems";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb/Breadcrumb";

export const EditListPage = () => {
  let { listId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState();

  const getExistingList = useCallback(async () => {
    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    const getListItemsUseCase = useCaseFactory.get(GetListItemsUseCase);
    list.items = await getListItemsUseCase.execute(listId);

    setPageState(list);
  }, [listId, useCaseFactory]);

  useEffect(() => {
    getExistingList();
  }, [listId, getExistingList]);

  return (
    <div>
      {pageState && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              {
                url: `/lists/${listId}`,
                text: pageState.name,
              },
            ]}
          />
          <h3 className="title">{`Edit list '${pageState.name}'`}</h3>
          <ListForm list={pageState} />
        </div>
      )}
    </div>
  );
};
