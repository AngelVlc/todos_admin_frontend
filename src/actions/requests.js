export const REQUEST_STARTED = 'REQUEST_STARTED';
export const REQUEST_DONE = 'REQUEST_DONE';
export const REQUEST_FAILED = 'REQUEST_FAILED'

export const requestPending = () => ({
  type: REQUEST_STARTED
})

export const requestDone = () => ({
  type: REQUEST_DONE
})

export const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
})
