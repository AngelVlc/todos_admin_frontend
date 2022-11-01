import React from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb/Breadcrumb";
import { ListItemForm } from "./ListItemForm";
import { ListItem } from "../../../domain";

export const NewListItemPage = () => {
  let { listId } = useParams();

  return (
    <div className="container">
      <Breadcrumb
        items={[
          { url: "/lists", text: "Lists" },
          { url:`/lists/${listId}`, text: "List" },
          { url: `/lists/${listId}/items/new`, text: "New" },
        ]}
      />
      <h3 className="title">New item</h3>
      <ListItemForm listItem={ListItem.createEmpty(listId)} />
    </div>
  );
};
