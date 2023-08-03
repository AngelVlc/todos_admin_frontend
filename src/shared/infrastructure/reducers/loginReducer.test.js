import { loginReducer } from '.';

test('should set the auth info', () => {
    const action = {
        type: 'USER_LOGGED_IN',
        authInfo: {
            name: 'name',
            id: 11,
            isAdmin: true
        }
    };

    const state = loginReducer({}, action);

    expect(state).toEqual({
        info: {
            name: 'name',
            id: 11,
            isAdmin: true
        }
    })
})

test('should remove the auth info', () => {
    const action = {
        type: 'USER_LOGGED_OUT'
    };

    const state = loginReducer({}, action);

    expect(state).toEqual({ info: null });
})