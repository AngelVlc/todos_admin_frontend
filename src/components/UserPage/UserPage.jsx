import React, { useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { AppContext } from '../../contexts/AppContext';
import { doPost, doPut } from '../../helpers/api';
import * as Yup from 'yup';

export const UserPage = (props) => {
    const { auth, requestsDispatch } = useContext(AppContext)
    let { userId } = useParams();
    let history = useHistory();

    const state = props.location.state;
    var returnUrl = '/'
    var title = 'New user'
    var submintBtnText = 'CREATE'
    var userName = ''
    var isAdmin = false
    var postUrl = 'users'
    if (state) {
        returnUrl = state.returnUrl;
        title = `Edit user '${state.userName}' (is admin: ${state.isAdmin})`
        submintBtnText = 'SAVE';
        ({ userName, isAdmin } = state);
        postUrl = `users/${userId}`;
    }

    const formik = useFormik({
        initialValues: {
            name: userName,
            isAdmin: isAdmin,
            newPassword: '',
            confirmNewPassword: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required')
        }),
        onSubmit: values => {
            if (!state) {
                doPost(postUrl, values, auth.info.token, requestsDispatch)
                    .then(() => {
                        history.push(returnUrl);
                    })
            } else {
                doPut(postUrl, values, auth.info.token, requestsDispatch)
                    .then(() => {
                        history.push(returnUrl);
                    })
            }
        }
    });

    return (
        <>
            <h4>{title}</h4>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                    <div>{formik.errors.name}</div>
                ) : null}
                <label htmlFor="newPassword">Password</label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                />
                {formik.touched.newPassword && formik.errors.newPassword ? (
                    <div>{formik.errors.newPassword}</div>
                ) : null}
                <label htmlFor="confirmNewPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmNewPassword}
                />
                <label htmlFor="isAdmin">Is Admin</label>
                <input
                    type="checkbox"
                    id="isAdmin"
                    name="isAdmin"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.isAdmin}
                />
                <button type="submit">{submintBtnText}</button>
                <button onClick={() => history.push(returnUrl)}>CANCEL</button>
            </form>
        </>
    )
}