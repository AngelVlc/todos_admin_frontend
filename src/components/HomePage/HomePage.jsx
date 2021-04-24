import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { AppContext } from '../../contexts/AppContext';

export const HomePage = () => {
    const { auth } = useContext(AppContext)
    let history = useHistory();

    return (
        <div className="container">
            <h3 className="title">HOME</h3>
            {auth.info?.isAdmin &&
                <button className="button" onClick={() => history.push('/users')} data-testid="users">Users</button>
            }
            <button className="button" onClick={() => history.push('/lists')} data-testid="lists">Lists</button>
        </div>
    )
}
