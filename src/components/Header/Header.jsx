import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { userLoggedOut } from '../../actions/auth';
import { useHistory } from "react-router-dom";

export const Header = () => {
    const { auth, authDispatch } = useContext(AppContext)
    let history = useHistory();

    const logoutClick = (authDispatch) => {
        authDispatch(userLoggedOut());
    }

    return (
        <nav className="navbar is-dark">
            <div className="navbar-brand">
                <span className="navbar-item is-size-3">To Dos</span>
            </div>
            <div className="navbar-menu">
                <div className="navbar-start">
                    {auth.info &&
                        <>
                            <span className="navbar-item" onClick={() => history.push('/')}>Home</span>
                            <span className="navbar-item" onClick={() => history.push('/lists')}>Lists</span>
                        </>
                    }
                    {auth.info && auth.info.isAdmin &&
                        <span className="navbar-item" onClick={() => history.push('/users')}>Users</span>
                    }
                </div>
            </div>
            {auth.info &&
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <button className="button is-light is-small" data-testid="logOut" onClick={() => logoutClick(authDispatch)}>
                                <span>{auth.info.userName}</span>
                                <span className="icon is-small">
                                    <i className="fas fa-sign-out-alt"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            }
        </nav>
    )
}
