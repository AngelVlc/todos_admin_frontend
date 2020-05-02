import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { Header } from '../Header';
import './App.css';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

function App() {
  

  return (
    <div>
      <Header />
      <div>

      </div>
      <Router history={history}>
        <Switch>
            <PrivateRoute exact path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export { App };
