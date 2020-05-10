import React, { useReducer, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { PrivateRoute } from '../../routers';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { UserDeletePage } from '../UserDeletePage';
import { UserPage } from '../UserPage';
import { Header } from '../Header';
import { createBrowserHistory } from "history";
import { authReducer, requestsReducer } from '../../reducers';
import { AppContext } from '../../contexts/AppContext';
import { requestErrorShowed } from '../../actions';
import Loader from 'react-loader-spinner';
import { useAlert } from 'react-alert'
import './App.css';

const history = createBrowserHistory();

const App = () => {
  const [auth, authDispatch] = useReducer(authReducer, [])
  const [request, requestsDispatch] = useReducer(requestsReducer, [])
  const alert = useAlert()

  useEffect(() => {
    if (request.error) {
      alert.show(request.error);
      requestsDispatch(requestErrorShowed())
    }
  }, [request.error, alert, requestsDispatch]);

  return (
    <AppContext.Provider value={{ auth, request, authDispatch, requestsDispatch }}>
      <Router history={history}>
        <Header />
        {request.pending &&
          <div className="loader">
            <Loader type="Circles" color="#282c34" height="100" width="100" />
          </div>
        }
        <Switch>
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute path="/user/:userId/delete" component={UserDeletePage} />
          <PrivateRoute path="/user/:userId/edit" component={UserPage} />
          <PrivateRoute path="/user/new" component={UserPage} />
          <Route path="/login">
            <LoginPage />
          </Route>
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </AppContext.Provider>
  );
}

export { App };
