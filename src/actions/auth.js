export const POST_TOKEN_SUCCESS = 'POST_TOKEN_SUCCESS';
export const POST_TOKEN_ERROR = 'POST_TOKEN_ERROR';
export const DO_LOGOUT = 'DO_LOGOUT'

export const postTokenSuccess = ({token, refreshToken}, {userName, userId, exp}) => ({
    type: POST_TOKEN_SUCCESS,
    authInfo: {
        token,
        refreshToken,
        userName,
        userId,
        exp
    }
})

export const postTokenError = (error) => ({
    type: POST_TOKEN_ERROR,
    error
})

export const doLogout = () => ({
    type: DO_LOGOUT
})
