import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListsUseCase, GetSearchSecureKeyUseCase } from "../../../application";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { Modal } from "../../../../shared/infrastructure/components/Modal";
import { SearchListsComponent } from "../ListsSearch";

export const ListsPage = () => {
  const [lists, setLists] = useState();
  const [searchSecureKey, setSearchSecureKey] = useState();
  const { useCaseFactory } = useContext(AppContext);
  let history = useHistory();
  const searchListRef = useRef();

  const getLists = useCallback(async () => {
    const getListsUseCase = useCaseFactory.get(GetListsUseCase);
    const data = await getListsUseCase.execute();

    setLists(data);
  }, [useCaseFactory]);

  const getSearchSecureKey = useCallback(async () => {
    const getSearchSecureKeyUseCase = useCaseFactory.get(
      GetSearchSecureKeyUseCase
    );
    const key = await getSearchSecureKeyUseCase.execute();

    setSearchSecureKey(key);
  }, [useCaseFactory]);

  useEffect(() => {
    getLists();
  }, [getLists]);

  useEffect(() => {
    getSearchSecureKey();
  }, [getSearchSecureKey]);

  const onNewClick = () => {
    history.push("/lists/new");
  };

  const onSearchClick = () => {
    searchListRef.current.showModal();
  }

  return (
    <>
      <Modal ref={searchListRef} showOk={false}>
        <SearchListsComponent searchSecureKey={searchSecureKey} />
      </Modal>
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
                    className="button is-small mr-2"
                    data-testid="search"
                    onClick={() => onSearchClick()}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-search"></i>
                    </span>
                  </button>
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
                  <tr
                    className="is-clickable"
                    key={list.id}
                    onClick={() => history.push(`/lists/${list.id}`)}
                    data-testid={`viewList${list.id}`}
                  >
                    <td>{list.name}</td>
                    <td>
                      <center>{list.itemsCount}</center>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
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
