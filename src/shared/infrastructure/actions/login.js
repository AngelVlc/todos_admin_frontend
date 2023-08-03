export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const userLoggedIn = ({name, id, isAdmin}) => ({
    type: USER_LOGGED_IN,
    authInfo: {
        name,
        id,
        isAdmin
    }
})

export const userLoggedOut = () => ({
    type: USER_LOGGED_OUT
})