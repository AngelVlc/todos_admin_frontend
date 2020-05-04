export const POST_TOKEN_PENDING = 'POST_TOKEN_PENDING';
export const POST_TOKEN_SUCCESS = 'POST_TOKEN_SUCCESS';
export const POST_TOKEN_ERROR = 'POST_TOKEN_ERROR';
export const DO_LOGOUT = 'DO_LOGOUT'

export const postTokenPending = () => ({
    type: POST_TOKEN_PENDING
});

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
