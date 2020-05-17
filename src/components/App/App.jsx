import React, { useReducer, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { PrivateRoute } from '../../routers';
import { LoginPage } from '../LoginPage';
import { HomePage } from '../HomePage';
import { UsersPage } from '../Users/UsersPage';
import { UserDeletePage } from '../Users/UserDeletePage';
import { UserPage } from '../Users/UserPage';
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
          <div className="reactLoader">
            <Loader type="Circles" color="#282c34" height="100" width="100" />
          </div>
        }
        <section className="section">
          <Switch>
            <PrivateRoute exact path="/" component={HomePage} />
            <PrivateRoute exact path="/users" component={UsersPage} />
            <PrivateRoute path="/users/:userId/delete" component={UserDeletePage} />
            <PrivateRoute path="/users/:userId/edit" component={UserPage} />
            <PrivateRoute path="/users/new" component={UserPage} />
            <Route path="/login">
              <LoginPage />
            </Route>
            <Redirect from="*" to="/" />
          </Switch>
        </section>
      </Router>
    </AppContext.Provider>
  );
}

export { App };
