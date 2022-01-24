import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    return (
        <Route {...rest} render={props => (
            userInfo
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )} />
    )
}
