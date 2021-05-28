import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

export const ListItemPage = () => {
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
            const res = await axios.get(`lists/${listId}/items/${itemId}`)
            const item = res.data

            setPageState({
                pageTitle: `Edit item '${item.title}'`,
                submintBtnText: 'SAVE',
                submitUrl: `lists/${listId}/items/${itemId}`,
                isNew: false,
                title: item.title,
                description: item.description
            });
        }
        if (listId && itemId) {
            getExistingItem();
        }
    }, [listId, itemId]);

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
                        await axios.post(pageState.submitUrl, body)
                    } else {
                        await axios.put(pageState.submitUrl, body)
                    }
                    history.push(`/lists/${listId}/edit`);
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
                            <button className="button" data-testid="cancel" type="button" onClick={() => history.push(`/lists/${listId}/edit`)}>CANCEL</button>
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
