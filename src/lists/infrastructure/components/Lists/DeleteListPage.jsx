import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb/Breadcrumb";
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
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              { url:`/lists/${listId}/edit`, text: list.name },
              { url: `/lists/${listId}/delete`, text: 'Delete' },
            ]}
          />
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
