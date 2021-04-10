import React, { useReducer, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { AdminRoute, PrivateRoute } from '../../routers';
import { LoginPage } from '../LoginPage';
import { HomePage } from '../HomePage';
import { ListsPage, ListPage, ListDeletePage, ListItemPage, ListItemDeletePage } from '../Lists';
import { UserDeletePage, UsersPage, UserPage } from '../Users';
import { Header } from '../Header';
import { createBrowserHistory } from "history";
import { authReducer, requestsReducer } from '../../reducers';
import { AppContext } from '../../contexts/AppContext';
import { requestStarted, requestDone, requestFailed, requestErrorShowed } from '../../actions';
import Loader from 'react-loader-spinner';
import { useAlert } from 'react-alert';
import axios from 'axios';
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

  // useEffect(() => {
  //   const prueba = async () => {
  //     try {
  //       // requestsDispatch(requestStarted());
  //       const data  = await axios.get(
  //         'http://localhost:5001/lists'
  //       );
  //       console.log("####", data, "####")
  //     } catch (error) {
  //       console.error("@@@", error, "@@@")
  //     }
  //   }
  //   prueba()
  // }, [requestsDispatch]);

  useEffect(() => {
    axios.interceptors.request.use(
      config => {
        config.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'
        
        console.log("request started", config)
        requestsDispatch(requestStarted());
        // console.log("##", config, "##")
        const token = "theToken"
        if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
        }
        // config.headers['Content-Type'] = 'application/json';
        return config;
      },
      error => {
        Promise.reject(error)
      }
    );

    axios.interceptors.response.use(
      (response) => {
        requestsDispatch(requestDone());
        console.log("RR", response, "RR")
        return response
      },
      (error) => {
        if (error.response.config.url == '/auth/login') {
          requestsDispatch(requestDone());
        } else {
          requestsDispatch(requestFailed(error.response.data));
        }
        return Promise.reject(error.response.data);
        // const originalRequest = error.config;
        // if (error.response.status === 401 && !originalRequest._retry) {
  
        //   originalRequest._retry = true;
        //   return axios.post('/auth/token',
        //       {
        //         "refresh_token": localStorageService.getRefreshToken()
        //       })
        //       .then(res => {
        //           if (res.status === 201) {
        //               // 1) put token to LocalStorage
        //               localStorageService.setToken(res.data);
  
        //               // 2) Change Authorization header
        //               axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorageService.getAccessToken();
  
        //               // 3) return originalRequest object with axios.
        //               return axios(originalRequest);
        //           }
        //       })
      }
    )
  }, []);


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
            <PrivateRoute exact path="/lists" component={ListsPage} />
            <AdminRoute path="/lists/new" component={ListPage} />
            <AdminRoute path="/lists/:listId/delete" component={ListDeletePage} />
            <AdminRoute path="/lists/:listId/edit" component={ListPage} />
            <AdminRoute path="/lists/:listId/items/new" component={ListItemPage} />
            <AdminRoute path="/lists/:listId/items/:itemId/delete" component={ListItemDeletePage} />
            <AdminRoute path="/lists/:listId/items/:itemId/edit" component={ListItemPage} />
            <AdminRoute exact path="/users" component={UsersPage} />
            <AdminRoute path="/users/:userId/delete" component={UserDeletePage} />
            <AdminRoute path="/users/:userId/edit" component={UserPage} />
            <AdminRoute path="/users/new" component={UserPage} />
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
