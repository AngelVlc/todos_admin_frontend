import React, { useRef, useContext } from 'react';
import { AppContext } from '../../contexts';
import { useHistory } from 'react-router-dom';

export const Header = () => {
    const { auth } = useContext(AppContext)
    const navBarMenuRef = useRef();
    const navBarBurguerRef = useRef();
    let history = useHistory();

    const onLogoutClick = () => {
        history.push('/login');
    }

    const onToggleNavBar = (e) => {
        navBarMenuRef.current.classList.toggle('is-active');
        navBarBurguerRef.current.classList.toggle('is-active');
    }

    return (
        <nav className="navbar is-dark">
            <div className="navbar-brand">
                <span className="navbar-item is-size-3">To Dos</span>
                {auth.info &&
                    <div className="navbar-burger" ref={navBarBurguerRef} onClick={(e) => onToggleNavBar(e)}>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </div>
                }
            </div>
            <div className="navbar-menu" ref={navBarMenuRef}>
                <div className="navbar-start">
                    {auth.info &&
                        <>
                            <span className="navbar-item" data-testid="goToRoot" onClick={() => history.push('/')}>Home</span>
                            <span className="navbar-item" data-testid="goToLists" onClick={() => history.push('/lists')}>Lists</span>
                        </>
                    }
                    {auth.info?.isAdmin &&
                        <span className="navbar-item" data-testid="goToUsers" onClick={() => history.push('/users')}>Users</span>
                    }
                </div>
            </div>
            {auth.info &&
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <button className="button is-light is-small" data-testid="logOut" onClick={() => onLogoutClick()}>
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
