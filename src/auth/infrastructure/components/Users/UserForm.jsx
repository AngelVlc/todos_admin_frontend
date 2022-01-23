import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import * as Yup from "yup";
import { User } from "../../../domain";
import { CreateUserUseCase } from "../../../application/users/CreateUserUseCase";
import { UpdateUserUseCase } from "../../../application/users/UpdateUserUseCase";

export const UserForm = (props) => {
  let history = useHistory();
  const { useCaseFactory } = useContext(AppContext);

  const [pageState, setPageState] = useState(
    new User({ id: undefined, name: "", isAdmin: false })
  );

  useEffect(() => {
    if (props.userId) {
      setPageState(
        new User({ id: props.userId, name: props.name, isAdmin: props.isAdmin })
      );
    }
  }, [props]);

  const onSubmit = async (user) => {
    let useCase;
    if (props.userId === undefined) {
      useCase = useCaseFactory.get(CreateUserUseCase);
    } else {
      useCase = useCaseFactory.get(UpdateUserUseCase);
    }
    const result = await useCase.execute(user);
    if (result) {
      history.push('/users');
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
            <Field name="name" type="text" data-testid="name" />
          </div>
          <p className="help is-danger" data-testid="userNameErrors">
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
          <p className="control">
            <button className="button" data-testid="submit" type="submit">
              {props.userId ? "UPDATE" : "CREATE"}
            </button>
          </p>
          <p className="control">
            <button
              className="button"
              data-testid="cancel"
              type="button"
              onClick={() => history.push("/users")}
            >
              CANCEL
            </button>
          </p>
          {props.userId && (
            <p className="control">
              <button
                className="button is-danger"
                data-testid="delete"
                type="button"
                onClick={() => history.push(`/users/${props.userId}/delete`)}
              >
                DELETE
              </button>
            </p>
          )}
        </div>
      </Form>
    </Formik>
  );
};
