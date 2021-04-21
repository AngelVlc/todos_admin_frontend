import axios from 'axios';
import { requestStarted, requestDone, requestFailed} from '../actions';

export const configure = (requestsDispatch) => {
  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'
  axios.defaults.withCredentials = true

  axios.interceptors.request.use(
    config => {
      requestsDispatch(requestStarted());

      return config;
    },
    error => {
      Promise.reject(error)
    },
  );

  axios.interceptors.response.use(
    (response) => {
      requestsDispatch(requestDone());

      return response
    },
    async error => {
      if (!error.response) {
        requestsDispatch(requestDone());
        return Promise.reject(error.message);
      }

      const originalRequest = error.config;
      if (error.response.status === 401 && error.response.data === 'Invalid authorization token\n' && !originalRequest._retry) {
        originalRequest._retry = true;
        const res = await axios.post('/auth/refreshtoken');
        if (res.status === 200) {
          return axios(originalRequest);
        }
      }

      if (error.response.status === 401 && error.response.data === 'Invalid refresh token\n') {
        localStorage.setItem('userInfo', null);
        window.open('/login');
      }

      if (error.response && error.response.config.url !== '/auth/login') {
        requestsDispatch(requestFailed(error.response.data));
      } else {
        requestsDispatch(requestDone());
      }

      return Promise.reject(error.response.data);
    }
  )
}