import React from "react";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { List } from "../../../domain";
import { ListForm } from "./ListForm";

export const NewListPage = () => {
  return (
    <div className="container">
      <Breadcrumb
        items={[
          { url: "/lists", text: "Lists" },
          { url: "/lists/new", text: "New" },
        ]}
      />
      <h3 className="title">New list</h3>
      <ListForm list={List.createEmpty()}/>
    </div>
  );
};
