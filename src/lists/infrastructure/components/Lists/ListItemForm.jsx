import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import * as Yup from "yup";
import { ListItem } from "../../../domain";
import {
  CreateListItemUseCase,
  UpdateListItemUseCase,
} from "../../../application/listItems";

export const ListItemForm = (props) => {
  let history = useHistory();
  const { useCaseFactory } = useContext(AppContext);

  const [pageState, setPageState] = useState(
    new ListItem({ title: "", description: "" })
  );

  useEffect(() => {
      setPageState(new ListItem(props.listItem));
  }, [props]);

  const onSubmit = async (listItem) => {
    let useCase;
    if (props.listItem?.id === undefined) {
      useCase = useCaseFactory.get(CreateListItemUseCase);
    } else {
      useCase = useCaseFactory.get(UpdateListItemUseCase);
    }

    const result = await useCase.execute(listItem);
    if (result) {
      history.push(`/lists/${props.listItem.listId}/edit`);
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
          <p className="control">
            <button className="button" data-testid="submit" type="submit">
              {props.listItem?.id ? "SAVE" : "CREATE"}
            </button>
          </p>
          <p className="control">
            <button
              className="button"
              data-testid="cancel"
              type="button"
              onClick={() =>
                history.push(`/lists/${props.listItem.listId}/edit`)
              }
            >
              CANCEL
            </button>
          </p>
          {props.listItem?.id && (
            <p className="control">
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
            </p>
          )}
        </div>
      </Form>
    </Formik>
  );
};
