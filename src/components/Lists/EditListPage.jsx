import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ListForm } from './ListForm';
import axios from 'axios';

export const EditListPage = () => {
    let { listId } = useParams();

    const [pageState, setPageState] = useState({name: '', items: []});

    useEffect(() => {
        const getExistingList = async () => {
            let res = await axios.get(`lists/${listId}`)
            const list = res.data

            res = await axios.get(`lists/${listId}/items`)
            const listItems = res.data

            setPageState({
                name: list.name,
                items: listItems
            });
        }
        getExistingList();
    }, [listId]);

    return (
        <div className="container">
            <h3 className="title">{`Edit list '${pageState.name}'`}</h3>
            <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li><Link to={`/`}>Home</Link></li>
                    <li><Link to={`/lists`}>Lists</Link></li>
                    <li className="is-active"><Link aria-current="page" to={`/lists/${listId}`}>{pageState.name}</Link></li>
                </ul>
            </nav>
            <ListForm listId={listId} name={pageState.name} items={pageState.items} isNew={false} submintBtnText='SAVE' submitUrl={`lists/${listId}`}/>
        </div>
    )
}
