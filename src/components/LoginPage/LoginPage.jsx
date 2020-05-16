import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userLoggedIn } from '../../actions'
import { AppContext } from '../../contexts/AppContext'
import * as Yup from 'yup';
import jwt from 'jwt-decode';
import { doGetToken } from '../../helpers/api';


export const LoginPage = () => {
    const { authDispatch, requestsDispatch } = useContext(AppContext)
    const [authError, setAuthError] = useState(null);
    let history = useHistory();

    return (
        <>
            <h4>LOG IN PAGE</h4>
            <Formik
                initialValues={{
                    userName: '',
                    password: ''
                }}
                validationSchema={Yup.object({
                    userName: Yup.string()
                        .required('Required'),
                    password: Yup.string()
                        .required('Required'),
                })
                }
                onSubmit={async (values) => {
                    try {
                        const res = await doGetToken(values, requestsDispatch);
                        const tokenInfo = jwt(res.token);
                        authDispatch(userLoggedIn(res, tokenInfo));
                        history.push('/');
                    } catch (error) {
                        setAuthError(error);
                    }
                }}>
                <Form>
                    <label htmlFor="userName">Name</label>
                    <Field name="userName" type="text" data-testid="userName" />
                    <span data-testid="userNameErrors">
                        <ErrorMessage name="userName" />
                    </span>

                    <label htmlFor="password">Password</label>
                    <Field name="password" type="password" data-testid="password" />
                    <span data-testid="passwordErrors">
                        <ErrorMessage name="password" />
                    </span>

                    {authError ? (
                        <div data-testid="authError">{authError}</div>
                    ) : null}
                    <button type="submit" data-testid="submit">Log In</button>
                </Form>
            </Formik>
        </>
    );
}
