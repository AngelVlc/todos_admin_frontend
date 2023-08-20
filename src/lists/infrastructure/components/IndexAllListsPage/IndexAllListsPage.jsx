import React, { useContext } from "react";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { YesNoButtons } from "../../../../shared/infrastructure/components/YesNoButtons";
import { useHistory } from "react-router-dom";
import { IndexAllListsUseCase } from "../../../application";

export const IndexAllListsPage = () => {
  const { useCaseFactory } = useContext(AppContext);
  let history = useHistory();

  const indexAllDocs = async () => {
    const indexAllUseCase = useCaseFactory.get(IndexAllListsUseCase);

    if (await indexAllUseCase.execute()) {
      history.push("/");
    }
  };

  return (
    <div className="container">
      <Breadcrumb
        items={[{ url: "/index-all-lists", text: "Index All Lists" }]}
      />
      <h3 className="title">Index All Lists</h3>
      <YesNoButtons onYes={indexAllDocs} onNo={() => history.push("/")} />
    </div>
  );
};
