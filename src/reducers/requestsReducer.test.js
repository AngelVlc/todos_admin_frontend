import { requestsReducer } from './';

test('should set pending to true when a request starts', () => {
    const action = { type: 'REQUEST_STARTED' }

    const state = requestsReducer({}, action);

    expect(state).toEqual({pending: true, error: null})
})

test('should set pending to false when a request ends', () => {
    const action = { type: 'REQUEST_DONE' }

    const state = requestsReducer({}, action);

    expect(state).toEqual({pending: false, error: null})
})

test('should set pending to false and an error when a request fails', () => {
    const action = { type: 'REQUEST_FAILED', error: "some error" }

    const state = requestsReducer({}, action);

    expect(state).toEqual({pending: false, error: "some error"})
})

test('should remove the error when the error is showd', () => {
    const action = { type: 'REQUEST_ERROR_SHOWED' }

    const state = requestsReducer({}, action);

    expect(state).toEqual({pending: false, error: null})
})
