import { POST_TOKEN_PENDING, POST_TOKEN_SUCCESS, POST_TOKEN_ERROR, DO_LOGOUT } from '../actions'

const initialState = {
    pending: false,
    info: null,
    error: null
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TOKEN_PENDING:
            return {
                ...state,
                pending: true
            };
        
        case POST_TOKEN_SUCCESS:
            return {
                ...state,
                pending: false,
                error:  null,
                info: action.authInfo
            };

        case POST_TOKEN_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error,
                info: null
            }

        case DO_LOGOUT:
            return {
                ...state,
                info: null
            }

        default:
            return state;
    }
};
