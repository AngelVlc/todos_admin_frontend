import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb/Breadcrumb";
import { UserForm } from "./UserForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetUserByIdUseCase } from "../../../application/users";

export const EditUserPage = () => {
  let { userId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setUser] = useState({ name: "" });

  const getUser = useCallback(async () => {
    const getUserByIdUseCase = useCaseFactory.get(GetUserByIdUseCase);
    const data = await getUserByIdUseCase.execute(userId);

    setUser(data);
  }, [userId, useCaseFactory]);

  useEffect(() => {
    getUser();
  }, [userId, getUser]);

  return (
    <div className="container">
      <Breadcrumb
        items={[
          { url: "/users", text: "Users" },
          { url: `/users/${userId}`, text: pageState.name },
        ]}
      />
      <h3 className="title">{`Edit user '${pageState.name}'`}</h3>
      <UserForm user={pageState}/>
    </div>
  );
};
