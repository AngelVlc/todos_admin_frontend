const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'

export const getToken = (loginDto) => {
    return new Promise((resolve, reject) => {
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
            })
            .catch(error => {
                reject(error.message);
            })
    });
}