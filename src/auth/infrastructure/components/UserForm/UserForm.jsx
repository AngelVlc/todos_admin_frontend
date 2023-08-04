import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import * as Yup from "yup";
import { CreateUserUseCase } from "../../../application/users/CreateUserUseCase";
import { UpdateUserUseCase } from "../../../application/users/UpdateUserUseCase";

export const UserForm = (props) => {
  let history = useHistory();
  const { useCaseFactory } = useContext(AppContext);

  const [pageState] = useState(props.user);

  const onSubmit = async (user) => {
    let useCase;
    if (props.user?.id === undefined) {
      useCase = useCaseFactory.get(CreateUserUseCase);
    } else {
      useCase = useCaseFactory.get(UpdateUserUseCase);
    }
    const result = await useCase.execute(user);
    if (result) {
      history.push("/users");
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={pageState}
      validationSchema={Yup.object({
        name: Yup.string().required("Required"),
      })}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="field">
          <label className="label" htmlFor="name">
            Name
          </label>
          <div className="control">
            <Field name="name" type="text" data-testid="name" autoFocus />
          </div>
          <p className="help is-danger" data-testid="nameErrors">
            <ErrorMessage name="name" />
          </p>
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="control">
            <Field name="password" type="password" data-testid="password" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="control">
            <Field
              name="confirmPassword"
              type="password"
              data-testid="confirmPassword"
            />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="isAdmin">
            Is Admin
          </label>
          <div className="control">
            <Field name="isAdmin" type="checkbox" data-testid="isAdmin" />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button" data-testid="submit" type="submit">
              {props.user?.id ? "UPDATE" : "CREATE"}
            </button>
          </div>
          <div className="control">
            <button
              className="button"
              data-testid="cancel"
              type="button"
              onClick={() => history.push("/users")}
            >
              CANCEL
            </button>
          </div>
          {props.children}
        </div>
      </Form>
    </Formik>
  );
};
