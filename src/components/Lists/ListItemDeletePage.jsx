import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

export const ListItemDeletePage = () => {
    const [item, setItem] = useState(null);
    let { listId, itemId } = useParams();
    let history = useHistory();

    useEffect(() => {
        const getListItem = async () => {
            const res = await axios.get(`lists/${listId}/items/${itemId}`)
            const info = {
                ...res.data,
                pageTitle: `Delete list item ${res.data.title}`
            }
            setItem(info);
        }
            getListItem();
    }, [listId, itemId]);

    const deleteListItem = async () => {
        await axios.delete(`lists/${listId}/items/${itemId}`)
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
