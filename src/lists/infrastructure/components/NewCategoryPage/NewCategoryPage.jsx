import React from "react";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { Category } from "../../../domain";
import { CategoryForm } from "../CategoryForm";

export const NewCategoryPage = () => {
  return (
    <div className="container">
      <Breadcrumb
        items={[
          { url: "/categories", text: "Categories" },
          { url: "/categories/new", text: "New" },
        ]}
      />
      <h3 className="title">New category</h3>
      <CategoryForm category={Category.createEmpty()} />
    </div>
  );
};
