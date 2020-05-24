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

            let title = `Edit user '${user.name}'`
            if (user.IsAdmin) {
                title = `Edit admin user '${user.name}'`
            }

            setPageState({
                title: title,
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
        <div className="container">
            <h3 className="title">{pageState.title}</h3>
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
                onSubmit={async ({ name, isAdmin, newPassword, confirmNewPassword }) => {
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
                        <label className="label" htmlFor="newPassword">Password</label>
                        <div className="control">
                            <Field name="newPassword" type="password" data-testid="newPassword" />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="confirmNewPassword">Confirm Password</label>
                        <div className="control">
                            <Field name="confirmNewPassword" type="password" data-testid="confirmNewPassword" />
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
                            <button className="button" data-testid="submit" type="submit">{pageState.submintBtnText}</button>
                        </p>
                        <p className="control">
                            <button className="button" data-testid="cancel" type="button" onClick={() => history.goBack()}>CANCEL</button>
                        </p>
                        {!pageState.isNew &&
                            <p className="control">
                                <button className="button is-danger" data-testid="delete" type="button" onClick={() => history.push(`/users/${userId}/delete`)}>DELETE</button>
                            </p>
                        }
                    </div>
                </Form>
            </Formik>
        </div>
    )
}