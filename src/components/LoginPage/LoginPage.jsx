import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import { userLoggedIn } from '../../actions'
import { AppContext } from '../../contexts/AppContext'
import * as Yup from 'yup';
import jwt from 'jwt-decode';
import { doGetToken } from '../../helpers/api';


export const LoginPage = () => {
    const { authDispatch, requestsDispatch } = useContext(AppContext)
    const [authError, setAuthError] = useState(null);
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
        onSubmit: async (values) => {
            try {
                const res = await doGetToken(values, requestsDispatch);
                const tokenInfo = jwt(res.token);
                authDispatch(userLoggedIn(res, tokenInfo));
                history.push('/');
            } catch (error) {
                setAuthError(error);
            }
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
                {authError ? (
                    <div>{authError}</div>
                ) : null}
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}
