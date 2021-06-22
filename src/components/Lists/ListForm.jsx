import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

export const ListForm = (props) => {
  let history = useHistory();

  const [pageState, setPageState] = useState({
    name: '',
    items: []
  });

  useEffect(() => {
    if (props.name) {
        setPageState({
            name: props.name,
            items: props.items
        })
    }
  }, [props]);

  const onSubmit = async ({ name }) => {
    const body = {
        name
    }
    let res;
    if (props.isNew) {
        res = await axios.post(props.submitUrl, body)
    } else {
        res = await axios.put(props.submitUrl, body)
    }
    history.push(`/lists/${res.data.id}/edit`);
  };

  return (
    <Formik
        enableReinitialize={true}
        initialValues={pageState}
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
            {!props.isNew &&
                <table className="table">
                    <thead>
                        <tr>
                            <td>Title</td>
                            <td>

                                <button className="button is-small" type="button" data-testid="addNew" onClick={() => history.push(`/lists/${props.listId}/items/new`)}>
                                    <span className="icon is-small">
                                        <i className="fas fa-plus"></i>
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {props.items.length > 0 && props.items.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <Link className="has-text-black" data-testid={`editListItem${item.id}`} to={`/lists/${props.listId}/items/${item.id}/edit`}>{item.title}</Link>
                                </td>
                                <td>
                                    <center>
                                        <Link className="has-text-black" data-testid={`deleteListItem${item.id}`} to={`/lists/${props.listId}/items/${item.id}/delete`}>
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
                    <button className="button" data-testid="submit" type="submit">{props.submintBtnText}</button>
                </p>
                <p className="control">
                    <button className="button" data-testid="cancel" type="button" onClick={() => history.push('/lists')}>CANCEL</button>
                </p>
                {!props.isNew &&
                    <p className="control">
                        <button className="button is-danger" data-testid="delete" type="button" onClick={() => history.push(`/lists/${props.listId}/delete`)}>DELETE</button>
                    </p>
                }
            </div>
        </Form>
    </Formik>
  )
}
