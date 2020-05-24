export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const userLoggedIn = ({token}, {userName, userId, isAdmin, exp}) => ({
    type: USER_LOGGED_IN,
    authInfo: {
        token,
        userName,
        userId,
        isAdmin,
        exp
    }
})

export const userLoggedOut = () => ({
    type: USER_LOGGED_OUT
})
