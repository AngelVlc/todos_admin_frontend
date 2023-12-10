import React, { useEffect, useState, useContext, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase, GetCategoriesUseCase } from "../../../application";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const ViewListPage = () => {
  let history = useHistory();
  let { listId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState();

  const getExistingList = useCallback(async () => {
    const getCategoriesUseCase = useCaseFactory.get(GetCategoriesUseCase);
    const categories = await getCategoriesUseCase.execute();

    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    const category = categories.find((c) => c.id === list.categoryId);

    if (category) {
      list.categoryName = category.name;
    }

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
              { url: `/lists/${listId}`, text: pageState.name },
            ]}
          />
          <h3 className="title">{`List '${pageState.name}'`}</h3>
          <h5 className="mb-5">{`Category ${pageState.categoryName}`}</h5>
          <div>
            {pageState.items.map((item) => (
              <article className="mb-2" key={item.id}>
                <h5>{item.title}</h5>
                {item.description && (
                  <pre className="is-size-7">{item.description}</pre>
                )}
              </article>
            ))}
          </div>
          <div className="field is-grouped mt-4">
            <div className="control">
              <button
                className="button"
                data-testid="edit"
                onClick={() => history.push(`/lists/${listId}`)}
              >
                EDIT
              </button>
            </div>
            <div className="control">
              <button
                className="button"
                data-testid="cancel"
                type="button"
                onClick={() => history.push("/lists")}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
