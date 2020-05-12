import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { AppContext } from '../../contexts/AppContext';
import { doPost, doPut, doGet } from '../../helpers/api';
import * as Yup from 'yup';

export const UserPage = (props) => {
    const { auth, requestsDispatch } = useContext(AppContext)
    let { userId } = useParams();
    let history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const res = await doGet(`users/${userId}`, auth.info.token, requestsDispatch)
            setUser(res);
        }
        if (auth.info && userId) {
            getUser();
        }
    }, [userId, auth.info, requestsDispatch]);

    var title = 'New user'
    var submintBtnText = 'CREATE'
    var postUrl = 'users'
    var userName, isAdmin = ''
    if (user) {
        userName = user.name
        isAdmin = user.isAdmin;
        title = `Edit user '${userName}' (is admin: ${isAdmin})`
        submintBtnText = 'SAVE';
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
        onSubmit: async (values) => {
            if (!user) {
                await doPost(postUrl, values, auth.info.token, requestsDispatch)
            } else {
                await doPut(postUrl, values, auth.info.token, requestsDispatch)
            }
            history.goBack();
        }
    });

    return (
        <>
            <p>{userName}</p>
            <h4>{title}</h4>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    autoComplete="off"
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                <button type="button" onClick={() => history.push(`/user/${userId}/delete`)}>DELETE</button>
                <button type="button" onClick={() => history.goBack()}>CANCEL</button>
            </form>
        </>
    )
}