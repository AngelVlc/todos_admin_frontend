import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
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
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to={`/`}>Home</Link>
          </li>
          <li>
            <Link to={`/users`}>Users</Link>
          </li>
          <li className="is-active">
            <Link aria-current="page" to={`/users/${userId}`}>
              {pageState.name}
            </Link>
          </li>
        </ul>
      </nav>
      <h3 className="title">{`Edit user '${pageState.name}'`}</h3>
      <UserForm user={pageState}/>
    </div>
  );
};
