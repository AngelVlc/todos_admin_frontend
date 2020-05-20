import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { doGet, doDelete } from '../../helpers/api';

export const ListDeletePage = () => {
    const { auth, requestsDispatch } = useContext(AppContext)
    const [list, setList] = useState(null);
    let { listId } = useParams();
    let history = useHistory();

    useEffect(() => {
        const getList = async () => {
            const res = await doGet(`lists/${listId}`, auth.info.token, requestsDispatch)
            const info = {
                ...res,
                title: `Delete list ${res.name}`
            }
            setList(info);
        }
        if (auth.info) {
            getList();
        }
    }, [listId, auth.info, requestsDispatch]);

    const deleteList = async () => {
        await doDelete(`lists/${listId}`, auth.info.token, requestsDispatch)
        history.goBack();
    }

    return (
        <>
            {list &&
                <div className="container">
                    <h3 className="title">{list.title}</h3>
                    <div className="buttons">
                        <button className="button is-danger" data-testid="yes" onClick={() => deleteList()}>YES</button>
                        <button className="button" data-testid="no" onClick={() => history.goBack()}>NO</button>
                    </div>
                </div>
            }
        </>
    );
}
