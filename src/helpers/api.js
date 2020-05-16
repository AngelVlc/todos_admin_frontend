import { requestStarted, requestDone, requestFailed } from '../actions'

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'

export const doGetToken = (loginDto, requestsDispatch) => {
    return new Promise(async (resolve, reject) => {
        requestsDispatch(requestStarted());
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginDto)
        };
        try {
            const res = await fetch(`${backendUrl}/auth/token`, requestOptions)
            requestsDispatch(requestDone());
            if (!res.ok) {
                const txt = await res.text()
                reject(txt);
                return
            }
            const obj = await res.json()
            resolve(obj);
        } catch (error) {
            requestsDispatch(requestDone());
            reject(error.message);
        }
    });
}

const getHeaders = (method, token) => {
    return {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    };
}

export const doGet = (endpoint, token, requestsDispatch) => {
    return new Promise(async (resolve, reject) => {
        requestsDispatch(requestStarted());
        const requestOptions = getHeaders('GET', token);
        try {
            const res = await fetch(`${backendUrl}/${endpoint}`, requestOptions)
            requestsDispatch(requestDone());
            if (res.ok) {
                const obj = await res.json()
                resolve(obj);
                return
            }
            const txt = await res.text()
            requestsDispatch(requestFailed(txt));
            reject(txt);
        } catch (error) {
            requestsDispatch(requestFailed(error.message));
            reject(error.message);
        }
    });
}

export const doDelete = (endpoint, token, requestsDispatch) => {
    return new Promise(async (resolve, reject) => {
        requestsDispatch(requestStarted());
        const requestOptions = getHeaders('DELETE', token);
        try {
            const res = await fetch(`${backendUrl}/${endpoint}`, requestOptions)
            requestsDispatch(requestDone());
            if (res.ok) {
                resolve();
                return
            }
            const txt = await res.text()
            requestsDispatch(requestFailed(txt));
            reject(txt)
        } catch (error) {
            requestsDispatch(requestFailed(error.message));
            reject(error.message);
        }
    });
}

export const doPost = (endpoint, body, token, requestsDispatch) => {
    return new Promise(async (resolve, reject) => {
        requestsDispatch(requestStarted());
        const requestOptions = getHeaders('POST', token);
        requestOptions.body = JSON.stringify(body);
        try {
            const res = await fetch(`${backendUrl}/${endpoint}`, requestOptions)
            requestsDispatch(requestDone());
            const txt = await res.text();
            if (res.ok) {
                resolve(txt);
                return
            }
            requestsDispatch(requestFailed(txt));
            reject(txt)
        } catch (error) {
            requestsDispatch(requestFailed(error.message));
            reject(error.message);
        }
    });
}

export const doPut = (endpoint, body, token, requestsDispatch) => {
    return new Promise(async (resolve, reject) => {
        requestsDispatch(requestStarted());
        const requestOptions = getHeaders('PUT', token);
        requestOptions.body = JSON.stringify(body);
        try {
            const res = await fetch(`${backendUrl}/${endpoint}`, requestOptions)
            requestsDispatch(requestDone());
            if (res.ok) {
                const obj = await res.json()
                resolve(obj);
                return
            }
            const txt = await res.text()
            requestsDispatch(requestFailed(txt));
            reject(txt)
        } catch (error) {
            requestsDispatch(requestFailed(error.message));
            reject(error.message);
        }
    });
}
