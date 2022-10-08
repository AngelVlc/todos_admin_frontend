import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListsUseCase } from "../../../application/lists";

export const ListsPage = () => {
  const [lists, setLists] = useState([]);
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
    <div className="container">
      <h3 className="title">LISTS</h3>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to={`/`}>Home</Link>
          </li>
          <li className="is-active">
            <Link aria-current="page" to={`/lists`}>
              Lists
            </Link>
          </li>
        </ul>
      </nav>
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
                    data-testid={`editList${list.id}`}
                    to={`/lists/${list.id}/edit`}
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
                    >
                    </Link>
                  </center>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
