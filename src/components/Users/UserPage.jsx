import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

export const UserPage = (props) => {
    let { userId } = useParams();
    let history = useHistory();

    const initialState = {
        title: '',
        submintBtnText: '',
        submitUrl: 'users',
        isNew: true,
        name: '',
        isAdmin: ''
    }

    const [pageState, setPageState] = useState(initialState);

    useEffect(() => {
        const getExistingUser = async () => {
            const res = await axios.get(`users/${userId}`)
            const user = res.data

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
        if (userId) {
            getExistingUser();
        } else {
            setPageState({
                title: 'New user',
                submintBtnText: 'CREATE',
                submitUrl: 'users',
                isNew: true,
                name: '',
                isAdmin: 'no'
            });
        }
    }, [userId]);

    return (
        <div className="container">
            <h3 className="title">{pageState.title}</h3>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    name: pageState.name,
                    isAdmin: pageState.isAdmin,
                    password: '',
                    confirmPassword: ''
                }}
                validationSchema={
                    Yup.object({
                        name: Yup.string()
                            .required('Required')
                    })
                }
                onSubmit={async ({ name, isAdmin, password, confirmPassword }) => {
                    const body = {
                        name,
                        password,
                        confirmPassword,
                        isAdmin: isAdmin === 'yes' ? true : false
                    }
                    if (pageState.isNew) {
                        await axios.post(pageState.submitUrl, body)
                    } else {
                        await axios.put(pageState.submitUrl, body)
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