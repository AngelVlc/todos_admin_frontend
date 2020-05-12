import { userLoggedIn, userLoggedOut } from './';

test('should generate user logged out action', () => {
    const tokens = {
        token: 'theToken',
        refreshToken: 'theRefreshToken'
    }

    const tokenInfo = {
        userName: 'name',
        userId: 11,
        exp: 1234567890
    }

    const action = userLoggedIn(tokens, tokenInfo);

    expect(action).toEqual({
        type: 'USER_LOGGED_IN',
        authInfo: {
            token: 'theToken',
            refreshToken: 'theRefreshToken',
            userName: 'name',
            userId: 11,
            exp: 1234567890
        }
    })
})

test('should generate user logged out action', () => {
    const action = userLoggedOut();

    expect(action).toEqual({
        type: 'USER_LOGGED_OUT'
    })
})
