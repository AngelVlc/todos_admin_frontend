import React, { useReducer, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { AdminRoute, PrivateRoute } from '../../routers';
import { LoginPage } from '../LoginPage';
import { HomePage } from '../HomePage';
import { Header } from '../Header';
import { ListsPage, NewListPage, EditListPage, ListDeletePage, NewListItemPage, EditListItemPage, ListItemDeletePage } from '../../../../lists/infrastructure/components/Lists';
import { UserDeletePage, UsersPage, NewUserPage, EditUserPage } from '../../../../auth/infrastructure/components/Users';
import { RefreshTokensPage } from '../../../../auth/infrastructure/components/RefreshTokens';
import { createBrowserHistory } from 'history';
import { loginReducer, requestsReducer } from '../../reducers';
import { AppContext } from '../../contexts';
import { requestErrorShowed, userLoggedIn} from '../../actions';
import { useAlert } from 'react-alert';
import { UseCaseFactory } from '../../UseCaseFactory';
import Loader from 'react-loader-spinner';
import * as axiosConfigure from '../../axiosConfigure';
import './App.css';

const browserHistory = createBrowserHistory();
const useCaseFactory = new UseCaseFactory()

const App = () => {
  const [auth, authDispatch] = useReducer(loginReducer, []);
  const [request, requestsDispatch] = useReducer(requestsReducer, []);
  const alert = useAlert();

  useEffect(() => {
    if (request.error) {
      alert.show(request.error);
      requestsDispatch(requestErrorShowed())
    }
  }, [request.error, alert, requestsDispatch]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      authDispatch(userLoggedIn(userInfo));
    }
    axiosConfigure.configure(requestsDispatch, browserHistory);
  }, [authDispatch]);

  return (
    <AppContext.Provider value={{ auth, authDispatch, useCaseFactory }}>
      <Router history={browserHistory}>
        <Header />
        {request.pending &&
          <div className="reactLoader">
            <Loader type="Circles" color="#282c34" height="100" width="100" />
          </div>
        }
        <section className="section">
          <Switch>
            <PrivateRoute exact path="/" component={HomePage} />
            <PrivateRoute exact path="/lists" component={ListsPage} />
            <PrivateRoute path="/lists/new" component={NewListPage} />
            <PrivateRoute path="/lists/:listId/delete" component={ListDeletePage} />
            <PrivateRoute path="/lists/:listId/edit" component={EditListPage} />
            <PrivateRoute path="/lists/:listId/items/new" component={NewListItemPage} />
            <PrivateRoute path="/lists/:listId/items/:itemId/delete" component={ListItemDeletePage} />
            <PrivateRoute path="/lists/:listId/items/:itemId/edit" component={EditListItemPage} />
            <AdminRoute exact path="/users" component={UsersPage} />
            <AdminRoute path="/users/:userId/delete" component={UserDeletePage} />
            <AdminRoute path="/users/:userId/edit" component={EditUserPage} />
            <AdminRoute path="/users/new" component={NewUserPage} />
            <AdminRoute exact path="/refreshtokens" component={RefreshTokensPage} />
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
