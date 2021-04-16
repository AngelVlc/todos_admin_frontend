import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';

export const Header = () => {
    const navBarMenuRef = useRef();
    const navBarBurguerRef = useRef();
    let history = useHistory();
    const userInfoStr = localStorage.getItem('userInfo');
    let userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

    const onLogoutClick = () => {
        localStorage.setItem('userInfo', null);
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
                {userInfo &&
                    <div className="navbar-burger" ref={navBarBurguerRef} onClick={(e) => onToggleNavBar(e)}>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </div>
                }
            </div>
            <div className="navbar-menu" ref={navBarMenuRef}>
                <div className="navbar-start">
                    {userInfo &&
                        <>
                            <span className="navbar-item" onClick={() => history.push('/')}>Home</span>
                            <span className="navbar-item" onClick={() => history.push('/lists')}>Lists</span>
                        </>
                    }
                    {userInfo?.isAdmin &&
                        <span className="navbar-item" onClick={() => history.push('/users')}>Users</span>
                    }
                </div>
            </div>
            {userInfo &&
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <button className="button is-light is-small" data-testid="logOut" onClick={() => onLogoutClick()}>
                                <span>{userInfo.userName}</span>
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
