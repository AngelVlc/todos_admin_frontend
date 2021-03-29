import { doGetToken, doRefreshToken, doGet, doDelete, doPut, doPost } from './api';

const mockRequestDispatch = jest.fn();

afterEach(() => {
    mockRequestDispatch.mockClear();
})

describe('doGetToken()', () => {
    it('should return an error if get token fails', async () => {
        const dto = { user: 'user', password: 'pass' }

        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((_, rej) => rej({ message: 'some error' }));
        });

        try {
            await doGetToken(dto, mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some error");
        }
        expect(global.fetch.mock.calls.length).toBe(1);
        expect(global.fetch.mock.calls[0][0]).toBe('http://localhost:5001/auth/login');
        const options = {
            body: "{\"user\":\"user\",\"password\":\"pass\"}",
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };
        expect(global.fetch.mock.calls[0][1]).toStrictEqual(options);
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[0][0]).toStrictEqual({ type: 'REQUEST_STARTED' });
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
    })

    it('should return an error if get token succed with an error', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: false, text: () => 'some api error' }));
        });

        try {
            await doGetToken({}, mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some api error");
        }
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
    })

    it('should return the result if get token succed', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: true, json: () => ({ token: 'theToken' }) }));
        });

        const res = await doGetToken({}, mockRequestDispatch);
        expect(res).toStrictEqual({ token: 'theToken' });
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
    })
})

describe('doRefreshToken()', () => {
    it('should return an error if refresh token fails', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((_, rej) => rej({ message: 'some error' }));
        });

        try {
            await doRefreshToken();
        } catch (e) {
            expect(e).toBe("some error");
        }
        expect(global.fetch.mock.calls.length).toBe(1);
        expect(global.fetch.mock.calls[0][0]).toBe('http://localhost:5001/auth/refreshtoken');
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };
        expect(global.fetch.mock.calls[0][1]).toStrictEqual(options);
    })

    it('should return an error if refresh token succed with an error', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: false, text: () => 'some api error' }));
        });

        try {
            await doRefreshToken({}, mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some api error");
        }
    })

    it('should return the result if refresh token succed', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: true, json: () => ({ token: 'theToken' }) }));
        });

        const res = await doRefreshToken({}, mockRequestDispatch);
        expect(res).toStrictEqual({ token: 'theToken' });
    })
})

describe('doGet()', () => {
    it('should return an error if get fails', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((_, rej) => rej({ message: 'some error' }));
        });

        try {
            await doGet('endpoint', 'theToken', mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some error");
        }
        expect(global.fetch.mock.calls.length).toBe(1);
        expect(global.fetch.mock.calls[0][0]).toBe('http://localhost:5001/endpoint');
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer theToken' },
            credentials: 'include'
        };
        expect(global.fetch.mock.calls[0][1]).toStrictEqual(options);
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[0][0]).toStrictEqual({ type: 'REQUEST_STARTED' });
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_FAILED', error: 'some error' });
    })

    it('should return an error if get succed with an error', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: false, text: () => 'some api error' }));
        });

        try {
            await doGet('endpoint', 'theToken', mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some api error");
        }
        expect(mockRequestDispatch.mock.calls.length).toBe(3);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
        expect(mockRequestDispatch.mock.calls[2][0]).toStrictEqual({ type: 'REQUEST_FAILED', error: 'some api error' });
    })

    it('should return the result if get succed', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: true, json: () => ({ value: 1 }) }));
        });

        const res = await doGet('endpoint', 'theToken', mockRequestDispatch);
        expect(res).toStrictEqual({ value: 1 });
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
    })
})

describe('doDelete()', () => {
    it('should return an error if delete fails', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((_, rej) => rej({ message: 'some error' }));
        });

        try {
            await doDelete('endpoint', 'theToken', mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some error");
        }
        expect(global.fetch.mock.calls.length).toBe(1);
        expect(global.fetch.mock.calls[0][0]).toBe('http://localhost:5001/endpoint');
        const options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer theToken' },
            credentials: 'include'
        };
        expect(global.fetch.mock.calls[0][1]).toStrictEqual(options);
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[0][0]).toStrictEqual({ type: 'REQUEST_STARTED' });
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_FAILED', error: 'some error' });
    })

    it('should return an error if delete succed with an error', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: false, text: () => 'some api error' }));
        });

        try {
            await doDelete('endpoint', 'theToken', mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some api error");
        }
        expect(mockRequestDispatch.mock.calls.length).toBe(3);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
        expect(mockRequestDispatch.mock.calls[2][0]).toStrictEqual({ type: 'REQUEST_FAILED', error: 'some api error' });
    })

    it('should return the result if delete succed', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: true }));
        });

        const res = await doDelete('endpoint', 'theToken', mockRequestDispatch);
        expect(res).toBeUndefined();
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
    })
})

describe('doPost()', () => {
    it('should return an error if post fails', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((_, rej) => rej({ message: 'some error' }));
        });

        try {
            await doPost('endpoint', { value: 1 }, 'theToken', mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some error");
        }
        expect(global.fetch.mock.calls.length).toBe(1);
        expect(global.fetch.mock.calls[0][0]).toBe('http://localhost:5001/endpoint');
        const options = {
            body: "{\"value\":1}",
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer theToken' },
            credentials: 'include'
        };
        expect(global.fetch.mock.calls[0][1]).toStrictEqual(options);
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[0][0]).toStrictEqual({ type: 'REQUEST_STARTED' });
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_FAILED', error: 'some error' });
    })

    it('should return an error if post succed with an error', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: false, text: () => 'some api error' }));
        });

        try {
            await doPost('endpoint', {}, 'theToken', mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some api error");
        }
        expect(mockRequestDispatch.mock.calls.length).toBe(3);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
        expect(mockRequestDispatch.mock.calls[2][0]).toStrictEqual({ type: 'REQUEST_FAILED', error: 'some api error' });
    })

    it('should return the result if post succed', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: true, text: () => 'result' }));
        });

        const res = await doPost('endpoint', {}, 'theToken', mockRequestDispatch);
        expect(res).toBe('result');
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
    })
})

describe('doPut()', () => {
    it('should return an error if put fails', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((_, rej) => rej({ message: 'some error' }));
        });

        try {
            await doPut('endpoint', { value: 1 }, 'theToken', mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some error");
        }
        expect(global.fetch.mock.calls.length).toBe(1);
        expect(global.fetch.mock.calls[0][0]).toBe('http://localhost:5001/endpoint');
        const options = {
            body: "{\"value\":1}",
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer theToken' },
            credentials: 'include'
        };
        expect(global.fetch.mock.calls[0][1]).toStrictEqual(options);
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[0][0]).toStrictEqual({ type: 'REQUEST_STARTED' });
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_FAILED', error: 'some error' });
    })

    it('should return an error if put succed with an error', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: false, text: () => 'some api error' }));
        });

        try {
            await doPut('endpoint', {}, 'theToken', mockRequestDispatch);
        } catch (e) {
            expect(e).toBe("some api error");
        }
        expect(mockRequestDispatch.mock.calls.length).toBe(3);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
        expect(mockRequestDispatch.mock.calls[2][0]).toStrictEqual({ type: 'REQUEST_FAILED', error: 'some api error' });
    })

    it('should return the result if put succed', async () => {
        global.fetch = jest.fn().mockImplementationOnce(async () => {
            return new Promise((res) => res({ ok: true, json: () => ({ value: 1 }) }));
        });

        const res = await doPut('endpoint', {}, 'theToken', mockRequestDispatch);
        expect(res).toStrictEqual({ value: 1 });
        expect(mockRequestDispatch.mock.calls.length).toBe(2);
        expect(mockRequestDispatch.mock.calls[1][0]).toStrictEqual({ type: 'REQUEST_DONE' });
    })
})
