import { authReducer } from './';

test('should set the auth info', () => {
    const action = {
        type: 'USER_LOGGED_IN',
        authInfo: {
            token: 'theToken',
            userName: 'name',
            userId: 11,
            exp: 1234567890
        }
    };

    const state = authReducer({}, action);

    expect(state).toEqual({
        info: {
            token: 'theToken',
            userName: 'name',
            userId: 11,
            exp: 1234567890
        }
    })
})

test('should remove the auth info', () => {
    const action = {
        type: 'USER_LOGGED_OUT'
    };

    const state = authReducer({}, action);

    expect(state).toEqual({ info: null });
})
