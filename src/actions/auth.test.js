import { userLoggedIn, userLoggedOut } from './';

test('should generate user logged out action', () => {
    const tokens = {
        token: 'theToken'
    }

    const tokenInfo = {
        userName: 'name',
        userId: 11,
        exp: 1234567890,
        isAdmin: true
    }

    const action = userLoggedIn(tokens, tokenInfo);

    expect(action).toEqual({
        type: 'USER_LOGGED_IN',
        authInfo: {
            token: 'theToken',
            userName: 'name',
            userId: 11,
            exp: 1234567890,
            isAdmin: true
        }
    })
})

test('should generate user logged out action', () => {
    const action = userLoggedOut();

    expect(action).toEqual({
        type: 'USER_LOGGED_OUT'
    })
})
