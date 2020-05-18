import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

export const AdminRoute = ({ component: Component, ...rest }) => {
    const { auth } = useContext(AppContext)

    return (
        <Route {...rest} render={props => (
            (auth.info && auth.info.isAdmin)
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )} />
    )
}
