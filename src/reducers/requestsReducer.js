import { REQUEST_PENDING, REQUEST_DONE } from '../actions'

const initialState = {
  pending: false
}

export const requestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_PENDING:
      return {
        ...state,
        pending: true
      }
    case REQUEST_DONE:
      return {
        ...state,
        pending: false
      }
    default:
      return state;
  }
};
