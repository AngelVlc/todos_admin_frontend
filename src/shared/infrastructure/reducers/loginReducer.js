import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../actions'

const initialState = {
    info: null
}

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGGED_IN:
            return {
                ...state,
                info: action.authInfo
            };

        case USER_LOGGED_OUT:
            return {
                ...state,
                info: null
            }

        default:
            return state;
    }
};