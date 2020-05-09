import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import { userLoggedIn, requestPending, requestDone, requestFailed } from '../../actions'
import { AppContext } from '../../contexts/AppContext'
import * as Yup from 'yup';
import jwt from 'jwt-decode';
import { getToken } from '../../helpers/api';


export const LoginPage = () => {
    const { authDispatch, request, requestsDispatch } = useContext(AppContext)
    let history = useHistory();

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: ''
        },
        validationSchema: Yup.object({
            userName: Yup.string()
                .required('Required'),
            password: Yup.string()
                .required('Required'),
        }),
        onSubmit: values => {
            requestsDispatch(requestPending());
            getToken(values)
                .then(res => {
                    const tokenInfo = jwt(res.token);
                    authDispatch(userLoggedIn(res, tokenInfo));
                    requestsDispatch(requestDone());
                    history.push('/');
                })
                .catch(error => {
                    requestsDispatch(requestFailed(error));
                })
        },
    });

    return (
        <div>
            <h4>LOG IN PAGE</h4>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="userName">Name</label>
                <input
                    id="userName"
                    name="userName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.userName}
                />
                {formik.touched.userName && formik.errors.userName ? (
                    <div>{formik.errors.userName}</div>
                ) : null}
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div>{formik.errors.password}</div>
                ) : null}
                {formik.errors.general ? (
                    <div>{formik.errors.general}</div>
                ) : null}
                {request.error ? (
                    <div>{request.error}</div>
                ) :  null               }
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}
