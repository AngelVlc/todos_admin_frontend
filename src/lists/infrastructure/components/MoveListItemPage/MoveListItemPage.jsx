import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import {
  GetListByIdUseCase,
  GetListsUseCase,
  MoveListItemUseCase,
} from "../../../application/lists";
import "./MoveListItemForm.css";

export const MoveListItemPage = () => {
  const [list, setList] = useState();
  const [lists, setLists] = useState();
  const [itemTitle, setItemTitle] = useState();
  const [selectedDestination, setSelectedDestination] = useState(null);
  const { useCaseFactory } = useContext(AppContext);
  let { listId, listItemId } = useParams();
  listId = parseInt(listId);
  listItemId = parseInt(listItemId);
  let history = useHistory();

  const getList = useCallback(async () => {
    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    setList(list);

    for (const item of list.items) {
      if (item.id === listItemId) {
        setItemTitle(item.title);
      }
    }
  }, [listId, listItemId, useCaseFactory]);

  const getLists = useCallback(async () => {
    const getListsUseCase = useCaseFactory.get(GetListsUseCase);
    const data = await getListsUseCase.execute();

    setLists(data);
  }, [useCaseFactory]);

  useEffect(() => {
    getList();
    getLists();
  }, [listId, getList, getLists]);

  const moveListItem = async () => {
    if (!selectedDestination) {
      return;
    }

    const useCase = useCaseFactory.get(MoveListItemUseCase);
    const result = await useCase.execute(listId, listItemId, selectedDestination);

    if (result) {
      history.push(`/lists/${listId}`);
    }

    console.log(selectedDestination);
  };

  return (
    <>
      {list && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              { url: `/lists/${listId}/edit`, text: list.name },
              { url: `/lists/${listId}/moveItem`, text: "Move Item" },
            ]}
          />
          <h3 className="title">{`Move list item ${itemTitle}`}</h3>

          <div className="control radio-list ml-4 mb-5">
            <>
              {lists &&
                lists.length > 0 &&
                lists
                  .filter((item) => item.id !== listId)
                  .map((item, index) => (
                    <div key={index} className="mb-3">
                      <label className="radio">
                        <input
                          type="radio"
                          name="destination"
                          className="mr-2"
                          value={item.id}
                          onChange={() => setSelectedDestination(item.id)}
                          data-testid={`radio-${item.id}`}
                        />
                        {item.name} ({item.itemsCount} items)
                      </label>
                    </div>
                  ))}
            </>
          </div>
          <div className="buttons">
            <button
              className="button is-danger"
              data-testid="yes"
              onClick={() => moveListItem()}
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
