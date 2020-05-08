import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { doLogout } from '../../actions/auth';
import './Header.css';

export const Header = () => {
    const { auth, authDispatch } = useContext(AppContext)

    const logoutClick = (authDispatch) => {
        authDispatch(doLogout());
    }

    return (
        <header className="Header">
            <h1>To Dos Admin</h1>
            {auth.info &&
                <>
                    <h4>User: {auth.info.userName}</h4>
                    <button onClick={() => logoutClick(authDispatch)}>Log out</button>
                </>
            }
        </header>
    )
}
