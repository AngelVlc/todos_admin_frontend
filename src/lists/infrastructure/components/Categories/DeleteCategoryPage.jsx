import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import {
  GetCategoryByIdUseCase,
  DeleteCategoryByIdUseCase,
} from "../../../application";
import { YesNoButtons } from "../../../../shared/infrastructure/components/YesNoButtons";

export const DeleteCategoryPage = () => {
  const [category, setCategory] = useState();
  const { useCaseFactory } = useContext(AppContext);
  let { categoryId } = useParams();
  let history = useHistory();

  const getCategory = useCallback(async () => {
    const getCategoryByIdUseCase = useCaseFactory.get(GetCategoryByIdUseCase);
    const category = await getCategoryByIdUseCase.execute(categoryId);

    setCategory(category);
  }, [categoryId, useCaseFactory]);

  useEffect(() => {
    getCategory();
  }, [categoryId, getCategory]);

  const deleteCategory = async () => {
    const deleteCategoryByIdUseCase = useCaseFactory.get(DeleteCategoryByIdUseCase);

    if (await deleteCategoryByIdUseCase.execute(categoryId)) {
      history.push("/categories");
    }
  };

  return (
    <>
      {category && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/categories", text: "Categories" },
              { url: `/categories/${categoryId}/delete`, text: 'Delete' },
            ]}
          />
          <h3 className="title">{`Delete category ${category.name}`}</h3>
          <YesNoButtons onYes={deleteCategory} onNo={() => history.push('/categories')}/>
        </div>
      )}
    </>
  );
};
