import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { CategoryForm } from "../CategoryForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetCategoryByIdUseCase } from "../../../application";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const EditCategoryPage = () => {
  let { categoryId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState();

  const getExistingCategory = useCallback(async () => {
    const getCategoryByIdUseCase = useCaseFactory.get(GetCategoryByIdUseCase);
    const category = await getCategoryByIdUseCase.execute(categoryId);

    setPageState(category);
  }, [categoryId, useCaseFactory]);

  useEffect(() => {
    getExistingCategory();
  }, [categoryId, getExistingCategory]);

  return (
    <>
      {pageState && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/categories", text: "Categories" },
              {
                url: `/categories/${categoryId}`,
                text: pageState.name,
              },
            ]}
          />
          <h3 className="title">{`Edit category '${pageState.name}'`}</h3>
          <CategoryForm category={pageState} />
        </div>
      )}
    </>
  );
};
