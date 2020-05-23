import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { doGet, doDelete } from '../../helpers/api';

export const ListItemDeletePage = () => {
    const { auth, requestsDispatch } = useContext(AppContext)
    const [item, setItem] = useState(null);
    let { listId, itemId } = useParams();
    let history = useHistory();

    useEffect(() => {
        const getListItem = async () => {
            const res = await doGet(`lists/${listId}/items/${itemId}`, auth.info.token, requestsDispatch)
            const info = {
                ...res,
                pageTitle: `Delete list item ${res.title}`
            }
            setItem(info);
        }
        if (auth.info) {
            getListItem();
        }
    }, [listId, itemId, auth.info, requestsDispatch]);

    const deleteListItem = async () => {
        await doDelete(`lists/${listId}/items/${itemId}`, auth.info.token, requestsDispatch)
        history.push(`/lists/${listId}/edit`);
    }

    return (
        <>
            {item &&
                <div className="container">
                    <h3 className="title">{item.pageTitle}</h3>
                    <div className="buttons">
                        <button className="button is-danger" data-testid="yes" onClick={() => deleteListItem()}>YES</button>
                        <button className="button" data-testid="no" onClick={() => history.goBack()}>NO</button>
                    </div>
                </div>
            }
        </>
    );
}
