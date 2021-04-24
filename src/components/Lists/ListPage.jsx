import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';


export const ListPage = () => {
    let { listId } = useParams();
    let history = useHistory();

    const initialState = {
        title: '',
        submintBtnText: '',
        submitUrl: '',
        isNew: true,
        name: '',
        items: []
    }
    const [pageState, setPageState] = useState(initialState);

    useEffect(() => {
        const getExistingList = async () => {
            let res = await axios.get(`lists/${listId}`)
            const list = res.data

            res = await axios.get(`lists/${listId}/items`)
            const listItems = res.data

            setPageState({
                title: `Edit list '${list.name}'`,
                submintBtnText: 'SAVE',
                submitUrl: `lists/${listId}`,
                isNew: false,
                name: list.name,
                items: listItems
            });
        }
        if (listId) {
            getExistingList();
        } else {
            setPageState({
                title: 'New list',
                submintBtnText: 'CREATE',
                submitUrl: 'lists',
                isNew: true,
                name: '',
                items: []
            });
        }
    }, [listId]);

    const onSubmit = async ({ name }) => {
        const body = {
            name
        }
        let res;
        if (pageState.isNew) {
            res = await axios.post(pageState.submitUrl, body)
        } else {
            res = await axios.put(pageState.submitUrl, body)
        }
        history.push(`/lists/${res.data.id}/edit`);
    };

    return (
        <div className="container">
            <h3 className="title">{pageState.title}</h3>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    name: pageState.name
                }}
                validationSchema={
                    Yup.object({
                        name: Yup.string()
                            .required('Required')
                    })
                }
                onSubmit={onSubmit}>
                <Form>
                    <div className="field">
                        <label className="label" htmlFor="name">Name</label>
                        <div className="control">
                            <Field name="name" type="text" data-testid="name" />
                        </div>
                        <p className="help is-danger" data-testid="nameErrors">
                            <ErrorMessage name="name" />
                        </p>
                    </div>
                    {!pageState.isNew &&
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>Title</td>
                                    <td>

                                        <button className="button is-small" type="button" data-testid="addNew" onClick={() => history.push(`/lists/${listId}/items/new`)}>
                                            <span className="icon is-small">
                                                <i className="fas fa-plus"></i>
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {pageState.items.length > 0 && pageState.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <Link className="has-text-black" data-testid={`editListItem${item.id}`} to={`/lists/${listId}/items/${item.id}/edit`}>{item.title}</Link>
                                        </td>
                                        <td>
                                            <center>
                                                <Link className="has-text-black" data-testid={`deleteListItem${item.id}`} to={`/lists/${listId}/items/${item.id}/delete`}>
                                                    <span className="icon is-small">
                                                        <i className="fas fa-trash-alt fa-xs"></i>
                                                    </span>
                                                </Link>
                                            </center>
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    }

                    <div className="field is-grouped">
                        <p className="control">
                            <button className="button" data-testid="submit" type="submit">{pageState.submintBtnText}</button>
                        </p>
                        <p className="control">
                            <button className="button" data-testid="cancel" type="button" onClick={() => history.push('/lists')}>CANCEL</button>
                        </p>
                        {!pageState.isNew &&
                            <p className="control">
                                <button className="button is-danger" data-testid="delete" type="button" onClick={() => history.push(`/lists/${listId}/delete`)}>DELETE</button>
                            </p>
                        }
                    </div>
                </Form>
            </Formik>
        </div>
    )
}
