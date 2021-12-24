import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

export const UserForm = (props) => {
  let history = useHistory();

  const [pageState, setPageState] = useState({
    name: '',
    isAdmin: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (props.name) {
        setPageState({
            name: props.name,
            isAdmin: props.isAdmin,
            password: '',
            confirmPassword: ''
        })
    }
  }, [props]);

  const onSubmit = async ({ name, isAdmin, password, confirmPassword }) => {
    const body = {
        name,
        password,
        confirmPassword,
        isAdmin: isAdmin === 'yes' ? true : false
    };
    if (props.isNew) {
        await axios.post(props.submitUrl, body);
    } else {
        await axios.put(props.submitUrl, body);
    }
    history.push(`/users`);
  }

  return (
          <Formik
              enableReinitialize={true}
              initialValues={pageState}
              validationSchema={
                  Yup.object({
                      name: Yup.string()
                          .required('Required')
                  })
              }
              onSubmit={onSubmit}>
              <Form>
                  <div className="field">
                      <label className="label" htmlFor="name">Name</label>
                      <div className="control">
                          <Field name="name" type="text" data-testid="name" />
                      </div>
                      <p className="help is-danger" data-testid="userNameErrors">
                          <ErrorMessage name="name" />
                      </p>
                  </div>

                  <div className="field">
                      <label className="label" htmlFor="password">Password</label>
                      <div className="control">
                          <Field name="password" type="password" data-testid="password" />
                      </div>
                  </div>

                  <div className="field">
                      <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                      <div className="control">
                          <Field name="confirmPassword" type="password" data-testid="confirmPassword" />
                      </div>
                  </div>

                  <div className="field">
                      <label className="label" htmlFor="isAdmin">Is Admin</label>
                      <div className="select">
                          <Field name="isAdmin" as="select" data-testid="isAdmin">
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                          </Field>
                      </div>
                  </div>

                  <div className="field is-grouped">
                      <p className="control">
                          <button className="button" data-testid="submit" type="submit">{props.submintBtnText}</button>
                      </p>
                      <p className="control">
                          <button className="button" data-testid="cancel" type="button" onClick={() => history.push('/users')}>CANCEL</button>
                      </p>
                      {!props.isNew &&
                          <p className="control">
                              <button className="button is-danger" data-testid="delete" type="button" onClick={() => history.push(`/users/${props.userId}/delete`)}>DELETE</button>
                          </p>
                      }
                  </div>
              </Form>
          </Formik>
  )
}