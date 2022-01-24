import { loginReducer } from '.';

test('should set the auth info', () => {
    const action = {
        type: 'USER_LOGGED_IN',
        authInfo: {
            userName: 'name',
            userId: 11,
            isAdmin: true
        }
    };

    const state = loginReducer({}, action);

    expect(state).toEqual({
        info: {
          userName: 'name',
          userId: 11,
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