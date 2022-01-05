import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import {
  GetUserByIdUseCase,
  DeleteUserByIdUseCase,
} from "../../../application/users";

export const UserDeletePage = () => {
  const [user, setUser] = useState(null);
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
          <h3 className="title">
            {user.isAdmin
              ? `Delete admin user '${user.name}'?`
              : `Delete user ${user.name}?`}
          </h3>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <Link to={`/`}>Home</Link>
              </li>
              <li>
                <Link to={`/users`}>Users</Link>
              </li>
              <li>
                <Link to={`/users`}>Users</Link>
              </li>
              <li>
                <Link aria-current="page" to={`/users/${userId}/edit`}>
                  {user.name}
                </Link>
              </li>
              <li className="is-active">
                <Link
                  aria-current="page"
                  to={`/users/${userId}/delete`}
                >{`Delete ${user.name}`}</Link>
              </li>
            </ul>
          </nav>
          <div className="buttons">
            <button
              className="button is-danger"
              data-testid="yes"
              onClick={() => deleteUser()}
            >
              YES
            </button>
            <button
              className="button"
              data-testid="no"
              onClick={() => history.goBack()}
            >
              NO
            </button>
          </div>
        </div>
      )}
    </>
  );
};
