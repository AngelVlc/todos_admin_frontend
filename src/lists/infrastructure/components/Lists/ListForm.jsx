import React, { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as Yup from "yup";
import "./ListForm.css";
import { List } from "../../../domain";
import {
  CreateListUseCase,
  UpdateListUseCase,
} from "../../../application/lists";

export const ListForm = (props) => {
  let history = useHistory();
  const { useCaseFactory } = useContext(AppContext);

  const [pageState, setPageState] = useState(props.list);

  const onSubmit = async (list) => {
    let useCase;
    if (props.list?.id === undefined) {
      useCase = useCaseFactory.get(CreateListUseCase);
    } else {
      useCase = useCaseFactory.get(UpdateListUseCase);
    }

    const result = await useCase.execute(list);
    if (result && props.list?.id === undefined) {
      history.push(`/lists/${result.id}`);
    }
  };

  const onDragEnd = (dropResult) => {
    const { destination, source } = dropResult;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newItems = Array.from(pageState.items);
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, pageState.items[source.index]);

    setPageState(new List({ ...pageState, items: newItems }));
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={pageState}
      validationSchema={Yup.object({
        name: Yup.string().required("Required"),
      })}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="field">
          <label className="label" htmlFor="name">
            Name
          </label>
          <div className="control">
            <Field
              name="name"
              as="input"
              className="input"
              data-testid="name"
              autoFocus
            />
          </div>
          <p className="help is-danger" data-testid="nameErrors">
            <ErrorMessage name="name" />
          </p>
        </div>
        <div className="field">
          <label className="label" htmlFor="isQuickList">
            Is Quick List
          </label>
          <div className="control">
            <Field
              name="isQuickList"
              type="checkbox"
              data-testid="isQuickList"
            />
          </div>
        </div>
        {props.list?.id && (
          <div>
            <div className="is-flex">
              <div className="is-flex-grow-4">
                <span className="label">List Items</span>
              </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="dnd-container">
                <div className="list-button mt-2 mb-2">
                  <button
                    className="button is-small"
                    type="button"
                    data-testid="addNew"
                    onClick={() =>
                      history.push(`/lists/${props.list.id}/items/new`)
                    }
                  >
                    <span className="icon is-small">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>Add</span>
                  </button>
                </div>
                <Droppable droppableId={props.list.id.toString()}>
                  {(provided) => (
                    <div
                      className="dnd-list"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {pageState.items.length > 0 &&
                        pageState.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id.toString()}
                            index={index}
                          >
                            {(draggableProvided) => (
                              <div
                                key={item.id}
                                className="is-flex dnd-item p-2 mb-2"
                                {...draggableProvided.draggableProps}
                                {...draggableProvided.dragHandleProps}
                                ref={draggableProvided.innerRef}
                                data-testid={`draggable${item.id}`}
                              >
                                <Link
                                  className="is-flex-grow-4"
                                  data-testid={`editListItem${item.id}`}
                                  to={`/lists/${props.list.id}/items/${item.id}/edit`}
                                >
                                  <div>
                                    <span className="has-text-black">
                                      {item.title}
                                    </span>
                                  </div>
                                </Link>
                                <div className="is-justify-content-flex-end">
                                  <center>
                                    <Link
                                      className="has-text-black delete"
                                      data-testid={`deleteListItem${item.id}`}
                                      to={`/lists/${props.list.id}/items/${item.id}/delete`}
                                    ></Link>
                                  </center>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          </div>
        )}

        <div className="field is-grouped">
          <div className="control">
            <button className="button" data-testid="submit" type="submit">
              {props.list?.id ? "SAVE" : "CREATE"}
            </button>
          </div>
          {props.list?.id && (
            <div className="control">
              <button
                className="button"
                data-testid="read"
                type="button"
                onClick={() => history.push(`/lists/${props.list.id}/read`)}
              >
                READ
              </button>
            </div>
          )}
          <div className="control">
            <button
              className="button"
              data-testid="cancel"
              type="button"
              onClick={() => history.push("/lists")}
            >
              CANCEL
            </button>
          </div>
          {props.list?.id && (
            <div className="control ml-auto is-pulled-right">
              <button
                className="button is-danger"
                data-testid="delete"
                type="button"
                onClick={() => history.push(`/lists/${props.list.id}/delete`)}
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
