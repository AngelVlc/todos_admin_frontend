import { requestPending, requestDone, requestFailed } from '../actions'

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'

export const doGetToken = (loginDto, requestsDispatch) => {
    return new Promise((resolve, reject) => {
        requestsDispatch(requestPending());
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginDto)
        };
        fetch(`${backendUrl}/auth/token`, requestOptions)
            .then(res => {
                if (res.ok) {
                    res.json().then(obj => {
                        resolve(obj);
                    })
                } else {
                    res.text().then(txt => reject(txt));
                }
                requestsDispatch(requestDone());
            })
            .catch(error => {
                requestsDispatch(requestFailed(error));
                reject(error.message);
            })
    });
}

export const doGet = (endpoint, token, requestsDispatch) => {
    return new Promise((resolve, reject) => {
        requestsDispatch(requestPending());
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        };
        fetch(`${backendUrl}/${endpoint}`, requestOptions)
            .then(res => {
                if (res.ok) {
                    res.json().then(obj => {
                        resolve(obj);
                    })
                } else {
                    res.text().then(txt => {
                        requestsDispatch(requestFailed(txt));
                        reject(txt)
                    });
                }
                requestsDispatch(requestDone());
            })
            .catch(error => {
                requestsDispatch(requestFailed(error));
                reject(error.message);
            })
    });
}
