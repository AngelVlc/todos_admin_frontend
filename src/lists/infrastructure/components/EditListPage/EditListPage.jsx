import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ListForm } from "../ListForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase } from "../../../application/lists";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const EditListPage = () => {
  let history = useHistory();
  let { listId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState();

  const getExistingList = useCallback(async () => {
    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    setPageState(list);
  }, [listId, useCaseFactory]);

  useEffect(() => {
    getExistingList();
  }, [listId, getExistingList]);

  return (
    <>
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
          <ListForm
            list={pageState}
            preCancel={
              <div className="control">
                <button
                  className="button"
                  data-testid="read"
                  type="button"
                  onClick={() => history.push(`/lists/${listId}/read`)}
                >
                  READ
                </button>
              </div>
            }
          />
        </div>
      )}
    </>
  );
};
