import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ListItemForm } from './ListItemForm';
import axios from 'axios';

export const EditListItemPage = () => {
    let { listId, itemId } = useParams();

    const [pageState, setPageState] = useState({title: ''});

    useEffect(() => {
        const getExistingItem = async () => {
            const res = await axios.get(`lists/${listId}/items/${itemId}`)
            const item = res.data

            setPageState({
                title: item.title,
                description: item.description
            });
        }
        getExistingItem()
    }, [listId, itemId]);

    return (
        <div className="container">
            <h3 className="title">{`Edit item '${pageState.title}'`}</h3>
            <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li><Link to={`/`}>Home</Link></li>
                    <li><Link to={`/lists`}>Lists</Link></li>
                    <li><Link to={`/lists/${listId}/edit`}>List</Link></li>
                    <li className="is-active"><Link aria-current="page" to={`/lists/${listId}/items/${itemId}/edit`}>{pageState.isNew ? 'new' : pageState.title}</Link></li>
                </ul>
            </nav>
            <ListItemForm listId={listId} itemId={itemId} title={pageState.title} description={pageState.description} isNew={false} submintBtnText='SAVE' submitUrl={`lists/${listId}/items/${itemId}`}/>
        </div>
    )
}
