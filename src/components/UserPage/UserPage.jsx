import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AppContext } from '../../contexts/AppContext';
import { doPost, doPut, doGet } from '../../helpers/api';
import * as Yup from 'yup';

export const UserPage = (props) => {
    const { auth, requestsDispatch } = useContext(AppContext)
    let { userId } = useParams();
    let history = useHistory();

    const initialState = {
        title: 'New user',
        submintBtnText: 'CREATE',
        submitUrl: 'users',
        isNew: true,
        name: '',
        isAdmin: 'no'
    }
    const [pageState, setPageState] = useState(initialState);

    useEffect(() => {
        const getExistingUser = async () => {
            const user = await doGet(`users/${userId}`, auth.info.token, requestsDispatch)

            setPageState({
                title: `Edit user '${user.name}' (is admin: ${user.isAdmin})`,
                submintBtnText: 'SAVE',
                submitUrl: `users/${userId}`,
                isNew: false,
                name: user.name,
                isAdmin: user.isAdmin ? 'yes' : 'no'
            });
        }
        if (auth.info && userId) {
            getExistingUser();
        }
    }, [userId, auth.info, requestsDispatch]);

    return (
        <>
            <h4>{pageState.title}</h4>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    name: pageState.name,
                    isAdmin: pageState.isAdmin,
                    newPassword: '',
                    confirmNewPassword: ''
                }}
                validationSchema={
                    Yup.object({
                        name: Yup.string()
                            .required('Required')
                    })
                }
                onSubmit={async ({name, isAdmin, newPassword, confirmNewPassword}) => {
                    const body = {
                        name,
                        newPassword,
                        confirmNewPassword,
                        isAdmin: isAdmin === 'yes' ? true : false
                    }
                    if (pageState.isNew) {
                        await doPost(pageState.submitUrl, body, auth.info.token, requestsDispatch)
                    } else {
                        await doPut(pageState.submitUrl, body, auth.info.token, requestsDispatch)
                    }
                    history.goBack();
                }}>
                <Form>
                    <label htmlFor="name">Name</label>
                    <Field name="name" type="text" data-testid="name" />
                    <span data-testid="userNameErrors">
                        <ErrorMessage name="name" />
                    </span>

                    <label htmlFor="newPassword">Password</label>
                    <Field name="newPassword" type="password" data-testid="newPassword" />

                    <label htmlFor="confirmNewPassword">Confirm Password</label>
                    <Field name="confirmNewPassword" type="password" data-testid="confirmNewPassword" />

                    <label htmlFor="isAdmin">Is Admin</label>
                    <Field name="isAdmin" as="select" data-testid="isAdmin">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </Field>

                    <button data-testid="submit" type="submit">{pageState.submintBtnText}</button>
                    {!pageState.isNew &&
                        <button data-testid="delete" type="button" onClick={() => history.push(`/user/${userId}/delete`)}>DELETE</button>
                    }
                    <button data-testid="cancel" type="button" onClick={() => history.goBack()}>CANCEL</button>
                </Form>
            </Formik>
        </>
    )
}