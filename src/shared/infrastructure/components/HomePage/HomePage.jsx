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
                <div className="box">
                    <h6 className="subtitle is-6">Admin</h6>
                    <div className="buttons">
                        <button className="button is-small" onClick={() => history.push('/users')} data-testid="users">Users</button>
                        <button className="button is-small" onClick={() => history.push('/refreshtokens')} data-testid="refreshTokens">Refresh Tokens</button>
                    </div>
                </div>
            }
            <div className="box">
                <h6 className="subtitle is-6">Lists</h6>
                <div className="buttons">
                    <button className="button is-small" onClick={() => history.push('/lists')} data-testid="lists">Lists</button>
                </div>
            </div>
        </div>
    )
}
