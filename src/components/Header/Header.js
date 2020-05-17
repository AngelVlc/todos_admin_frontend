import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { userLoggedOut } from '../../actions/auth';

export const Header = () => {
    const { auth, authDispatch } = useContext(AppContext)

    const logoutClick = (authDispatch) => {
        authDispatch(userLoggedOut());
    }

    return (
        <nav className="navbar is-dark">
            <div className="navbar-brand">
                <span className="navbar-item is-size-3">To Dos Admin</span>
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
