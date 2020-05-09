import { REQUEST_STARTED, REQUEST_DONE, REQUEST_FAILED } from '../actions'

const initialState = {
  pending: false
}

export const requestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_STARTED:
      return {
        ...state,
        pending: true,
        error: null
      }
    case REQUEST_DONE:
      return {
        ...state,
        pending: false,
        error: null
      }
    case REQUEST_FAILED:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default:
      return state;
  }
};
