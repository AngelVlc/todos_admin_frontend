import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { YesNoButtons } from "../../../../shared/infrastructure/components/YesNoButtons";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import {
  GetUserByIdUseCase,
  DeleteUserByIdUseCase,
} from "../../../application/users";

export const DeleteUserPage = () => {
  const [user, setUser] = useState();
  const { useCaseFactory } = useContext(AppContext);
  let { userId } = useParams();
  let history = useHistory();

  const getUser = useCallback(async () => {
    const getUserByIdUseCase = useCaseFactory.get(GetUserByIdUseCase);
    const user = await getUserByIdUseCase.execute(userId);

    setUser(user);
  }, [userId, useCaseFactory]);

  useEffect(() => {
    getUser();
  }, [userId, getUser]);

  const deleteUser = async () => {
    const deleteUserByIdUseCase = useCaseFactory.get(DeleteUserByIdUseCase);

    if (await deleteUserByIdUseCase.execute(userId)) {
      history.push("/users");
    }
  };

  return (
    <>
      {user && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/users", text: "Users" },
              { url: `/users/${userId}/delete`, text: `Delete ${user.name}` },
            ]}
          />
          <h3 className="title">
            {user.isAdmin
              ? `Delete admin user '${user.name}'?`
              : `Delete user ${user.name}?`}
          </h3>
          <YesNoButtons onYes={deleteUser} onNo={() => history.push('/users')}/>
        </div>
      )}
    </>
  );
};
