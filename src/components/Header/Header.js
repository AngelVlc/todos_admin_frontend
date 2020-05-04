import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { doLogout } from '../../actions/auth';
import './Header.css';

export const Header = () => {
    const { auth, dispatch } = useContext(AuthContext)

    const logoutClick = (dispatch) => {
        dispatch(doLogout());
    }

    return (
        <header className="Header">
            <h1>To Dos Admin</h1>
            {auth.info &&
                <>
                    <h4>User: {auth.info.userName}</h4>
                    <button onClick={() => logoutClick(dispatch)}>Log out</button>
                </>
            }
        </header>
    )
}
