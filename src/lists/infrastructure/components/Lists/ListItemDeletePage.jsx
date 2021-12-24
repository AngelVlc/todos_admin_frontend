import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
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
                    <nav className="breadcrumb" aria-label="breadcrumbs">
                        <ul>
                            <li><Link to={`/`}>Home</Link></li>
                            <li><Link to={`/lists`}>Lists</Link></li>
                            <li><Link to={`/lists/${listId}/edit`}>List</Link></li>
                            <li><Link to={`/lists/${listId}/items/${itemId}/edit`}>{item.title}</Link></li>
                            <li className="is-active"><Link aria-current="page" to={`/lists/${listId}/items/${itemId}/delete`}>{`Delete ${item.title}`}</Link></li>
                        </ul>
                    </nav>
                    <div className="buttons">
                        <button className="button is-danger" data-testid="yes" onClick={() => deleteListItem()}>YES</button>
                        <button className="button" data-testid="no" onClick={() => history.goBack()}>NO</button>
                    </div>
                </div>
            }
        </>
    );
}
