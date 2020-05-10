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
                requestsDispatch(requestDone());
                if (!res.ok) {
                    res.text().then(txt => reject(txt));
                    return
                }
                res.json().then(obj => {
                    resolve(obj);
                })
            })
            .catch(error => {
                requestsDispatch(requestDone());
                reject(error.message);
            })
    });
}

const getHeaders = (method, token) => {
    return {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    };
}

export const doGet = (endpoint, token, requestsDispatch) => {
    return new Promise((resolve, reject) => {
        requestsDispatch(requestPending());
        const requestOptions = getHeaders('GET', token);
        fetch(`${backendUrl}/${endpoint}`, requestOptions)
            .then(res => {
                requestsDispatch(requestDone());
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
            })
            .catch(error => {
                requestsDispatch(requestFailed(error.message));
                reject(error.message);
            })
    });
}

export const doDelete = (endpoint, token, requestsDispatch) => {
    return new Promise((resolve, reject) => {
        requestsDispatch(requestPending());
        const requestOptions = getHeaders('DELETE', token);
        fetch(`${backendUrl}/${endpoint}`, requestOptions)
            .then(res => {
                requestsDispatch(requestDone());
                if (res.ok) {
                    resolve();
                    return
                }
                res.text().then(txt => {
                    requestsDispatch(requestFailed(txt));
                    reject(txt)
                });
            })
            .catch(error => {
                requestsDispatch(requestFailed(error.message));
                reject(error.message);
            })
    });
}

export const doPost = (endpoint, body, token, requestsDispatch) => {
    return new Promise((resolve, reject) => {
        requestsDispatch(requestPending());
        const requestOptions = getHeaders('POST', token);
        requestOptions.body = JSON.stringify(body);
        fetch(`${backendUrl}/${endpoint}`, requestOptions)
            .then(res => {
                requestsDispatch(requestDone());
                res.text().then(txt => {
                    if (res.ok) {
                        resolve(txt);
                        return
                    }
                    requestsDispatch(requestFailed(txt));
                    reject(txt)
                });
            })
            .catch(error => {
                requestsDispatch(requestFailed(error.message));
                reject(error.message);
            })
    });
}
