import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import {
  GetListByIdUseCase,
  DeleteListByIdUseCase,
} from "../../../application";
import { YesNoButtons } from "../../../../shared/infrastructure/components/YesNoButtons";

export const DeleteListPage = () => {
  const [list, setList] = useState();
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
              { url: `/lists/${listId}/delete`, text: 'Delete' },
            ]}
          />
          <h3 className="title">{`Delete list ${list.name}`}</h3>
          <YesNoButtons onYes={deleteList} onNo={() => history.push('/lists')}/>
        </div>
      )}
    </>
  );
};
