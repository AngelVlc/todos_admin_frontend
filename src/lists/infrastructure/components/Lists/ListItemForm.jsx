import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import * as Yup from "yup";
import {
  CreateListItemUseCase,
  UpdateListItemUseCase,
} from "../../../application/listItems";

export const ListItemForm = (props) => {
  let history = useHistory();
  const { useCaseFactory } = useContext(AppContext);

  const [pageState] = useState(props.listItem);

  const onSubmit = async (listItem) => {
    let useCase;
    if (props.listItem?.id === undefined) {
      useCase = useCaseFactory.get(CreateListItemUseCase);
    } else {
      useCase = useCaseFactory.get(UpdateListItemUseCase);
    }

    const result = await useCase.execute(listItem);
    if (result) {
      history.push(`/lists/${props.listItem.listId}`);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={pageState}
      validationSchema={Yup.object({
        title: Yup.string().required("Required"),
      })}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="field">
          <label className="label" htmlFor="title">
            Title
          </label>
          <div className="control">
            <Field
              name="title"
              as="input"
              className="input"
              data-testid="title"
              autoFocus
            />
          </div>
          <p className="help is-danger" data-testid="titleErrors">
            <ErrorMessage name="title" />
          </p>
        </div>

        <div className="field">
          <label className="label" htmlFor="description">
            Description
          </label>
          <div className="control">
            <Field
              name="description"
              as="textarea"
              className="textarea"
              data-testid="description"
            />
          </div>
          <p className="help is-danger" data-testid="descriptionErrors">
            <ErrorMessage name="description" />
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button" data-testid="submit" type="submit">
              {props.listItem?.id ? "SAVE" : "CREATE"}
            </button>
          </div>
          <div className="control">
            <button
              className="button"
              data-testid="cancel"
              type="button"
              onClick={() => history.push(`/lists/${props.listItem.listId}`)}
            >
              CANCEL
            </button>
          </div>
          {props.listItem?.id && (
            <div className="control">
              <button
                className="button is-danger"
                data-testid="delete"
                type="button"
                onClick={() =>
                  history.push(
                    `/lists/${props.listItem.listId}/items/${props.listItem.id}/delete`
                  )
                }
              >
                DELETE
              </button>
            </div>
          )}
        </div>
      </Form>
    </Formik>
  );
};
