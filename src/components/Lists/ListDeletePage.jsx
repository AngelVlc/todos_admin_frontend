import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

export const ListDeletePage = () => {
    const [list, setList] = useState(null);
    let { listId } = useParams();
    let history = useHistory();

    useEffect(() => {
        const getList = async () => {
            const res = await axios.get(`lists/${listId}`)
            const info = {
                ...res.data,
                title: `Delete list ${res.data.name}`
            }
            setList(info);
        }
            getList();
    }, [listId]);

    const deleteList = async () => {
        await axios.delete(`lists/${listId}`)
        history.push('/lists');
    }

    return (
        <>
            {list &&
                <div className="container">
                    <h3 className="title">{list.title}</h3>
                    <nav className="breadcrumb" aria-label="breadcrumbs">
                        <ul>
                            <li><Link to={`/`}>Home</Link></li>
                            <li><Link to={`/lists`}>Lists</Link></li>
                            <li><Link to={`/lists/${listId}/edit`}>List</Link></li>
                            <li className="is-active"><Link aria-current="page" to={`/lists/${listId}/delete`}>{`Delete ${list.name}`}</Link></li>
                        </ul>
                    </nav>
                    <div className="buttons">
                        <button className="button is-danger" data-testid="yes" onClick={() => deleteList()}>YES</button>
                        <button className="button" data-testid="no" onClick={() => history.goBack()}>NO</button>
                    </div>
                </div>
            }
        </>
    );
}
