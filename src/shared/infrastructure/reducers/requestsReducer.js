import { REQUEST_STARTED, REQUEST_DONE, REQUEST_FAILED, REQUEST_ERROR_SHOWED } from '../../../actions'

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
    case REQUEST_ERROR_SHOWED:
      return {
        ...state,
        pending: false,
        error: null
      }
    default:
      return state;
  }
};
