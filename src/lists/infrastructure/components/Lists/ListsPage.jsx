import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListsUseCase } from "../../../application/lists";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const ListsPage = () => {
  const [lists, setLists] = useState();
  const { useCaseFactory } = useContext(AppContext);
  let history = useHistory();

  const getLists = useCallback(async () => {
    const getListsUseCase = useCaseFactory.get(GetListsUseCase);
    const data = await getListsUseCase.execute();

    setLists(data);
  }, [useCaseFactory]);

  useEffect(() => {
    getLists();
  }, [getLists]);

  const onNewClick = () => {
    history.push("/lists/new");
  };

  return (
    <>
      {lists && (
        <div className="container">
          <Breadcrumb items={[{ url: "/lists", text: "Lists" }]} />
          <h3 className="title">LISTS</h3>
          <table className="table">
            <thead>
              <tr>
                <td>Name</td>
                <td># Items</td>
                <td>
                  <button
                    className="button is-small"
                    data-testid="addNew"
                    onClick={() => onNewClick()}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-plus"></i>
                    </span>
                  </button>
                </td>
              </tr>
            </thead>
            <tbody>
              {lists.length > 0 &&
                lists.map((list) => (
                  <tr key={list.id}>
                    <td>
                      <Link
                        className="has-text-black"
                        data-testid={`viewList${list.id}`}
                        to={`/lists/${list.id}`}
                      >
                        {list.name}
                      </Link>
                    </td>
                    <td>
                      <span>
                        <center>{list.itemsCount}</center>
                      </span>
                    </td>
                    <td>
                      <center>
                        <Link
                          className="has-text-black delete"
                          data-testid={`deleteList${list.id}`}
                          to={`/lists/${list.id}/delete`}
                        ></Link>
                      </center>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
