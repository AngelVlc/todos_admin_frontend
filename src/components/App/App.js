import React, { useReducer } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { PrivateRoute } from '../../routers';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { Header } from '../Header';
import { createBrowserHistory } from "history";
import { authReducer } from '../../reducers/authReducer';
import { AuthContext } from '../../contexts/AuthContext';
import Loader from 'react-loader-spinner';
import './App.css';

const history = createBrowserHistory();

const App = () => {
  const [auth, dispatch] = useReducer(authReducer, [])

  return (
    <AuthContext.Provider value={{ auth, dispatch }}>
      <Router history={history}>
        <Header />
        {auth.pending &&
          <div className="loader"        >
            <Loader type="Circles" color="#282c34" height="100" width="100" />
          </div>
        }
        <Switch>
          <PrivateRoute exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export { App };
