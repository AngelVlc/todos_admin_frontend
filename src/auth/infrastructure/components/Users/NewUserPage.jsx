import React from "react";
import { Link } from "react-router-dom";
import { UserForm } from "./UserForm";

export const NewUserPage = () => {
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
            <Link aria-current="page" to={"/users/new"}>
              New
            </Link>
          </li>
        </ul>
      </nav>
      <h3 className="title">New user</h3>
      <UserForm />
    </div>
  );
};
