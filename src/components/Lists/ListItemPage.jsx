import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AppContext } from '../../contexts/AppContext';
import { doPost, doPut, doGet } from '../../helpers/api';
import * as Yup from 'yup';

export const ListItemPage = () => {
    const { auth, requestsDispatch } = useContext(AppContext)
    let { listId, itemId } = useParams();
    let history = useHistory();

    const initialState = {
        pageTitle: 'New item',
        submintBtnText: 'CREATE',
        submitUrl: `lists/${listId}/items`,
        isNew: true,
        title: '',
        description: ''
    }
    const [pageState, setPageState] = useState(initialState);

    useEffect(() => {
        const getExistingItem = async () => {
            const item = await doGet(`lists/${listId}/items/${itemId}`, auth.info.token, requestsDispatch)

            setPageState({
                pageTitle: `Edit item '${item.title}'`,
                submintBtnText: 'SAVE',
                submitUrl: `lists/${listId}/items/${itemId}`,
                isNew: false,
                title: item.title,
                description: item.description
            });
        }
        if (auth.info && listId && itemId) {
            getExistingItem();
        }
    }, [listId, itemId, auth.info, requestsDispatch]);

    return (
        <div className="container">
            <h3 className="title">{pageState.pageTitle}</h3>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    title: pageState.title,
                    description: pageState.description
                }}
                validationSchema={
                    Yup.object({
                        title: Yup.string()
                            .required('Required')
                    })
                }
                onSubmit={async ({ title, description }) => {
                    const body = {
                        title,
                        description
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
                        <label className="label" htmlFor="title">Title</label>
                        <div className="control">
                            <Field name="title" type="text" data-testid="title" />
                        </div>
                        <p className="help is-danger" data-testid="titleErrors">
                            <ErrorMessage name="title" />
                        </p>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="description">Description</label>
                        <div className="control">
                            <Field name="description" type="text" data-testid="description" />
                        </div>
                        <p className="help is-danger" data-testid="descriptionErrors">
                            <ErrorMessage name="description" />
                        </p>
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
                                <button className="button is-danger" data-testid="delete" type="button" onClick={() => history.push(`/lists/${listId}/items/${itemId}/delete`)}>DELETE</button>
                            </p>
                        }
                    </div>
                </Form>
            </Formik>
        </div>
    )
}
