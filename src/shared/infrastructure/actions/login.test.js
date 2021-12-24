import { userLoggedIn, userLoggedOut } from '.';

test('should generate user logged out action', () => {
    const action = userLoggedIn({userName: 'name', userId: 11, isAdmin: true});

    expect(action).toEqual({
        type: 'USER_LOGGED_IN',
        authInfo: {
            userName: 'name',
            userId: 11,
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