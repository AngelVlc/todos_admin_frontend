import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const AdminRoute = ({ component: Component, ...rest }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    return (
        <Route {...rest} render={props => (
            (userInfo?.isAdmin)
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )} />
    )
}
