import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

export const ListItemForm = (props) => {
    let history = useHistory();

    const initialState = {
        title: '',
        description: ''
    }
    const [pageState, setPageState] = useState(initialState);

    useEffect(() => {
        if (props.title) {
            setPageState({
                title: props.title,
                description: props.description
            })
        }
    }, [props]);

    const onSubmit = async ({ title, description }) => {
        const body = {
            title,
            description
        }
        if (props.isNew) {
            await axios.post(props.submitUrl, body)
        } else {
            await axios.put(props.submitUrl, body)
        }
        history.push(`/lists/${props.listId}/edit`);
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={pageState}
            validationSchema={
                Yup.object({
                    title: Yup.string()
                        .required('Required')
                })
            }
            onSubmit={onSubmit}>
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
                        <button className="button" data-testid="submit" type="submit">{props.submintBtnText}</button>
                    </p>
                    <p className="control">
                        <button className="button" data-testid="cancel" type="button" onClick={() => history.push(`/lists/${props.listId}/edit`)}>CANCEL</button>
                    </p>
                    {!props.isNew &&
                        <p className="control">
                            <button className="button is-danger" data-testid="delete" type="button" onClick={() => history.push(`/lists/${props.listId}/items/${props.itemId}/delete`)}>DELETE</button>
                        </p>
                    }
                </div>
            </Form>
        </Formik>
    )
}
