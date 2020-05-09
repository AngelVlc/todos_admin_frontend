export const REQUEST_STARTED = 'REQUEST_STARTED';
export const REQUEST_DONE = 'REQUEST_DONE';
export const REQUEST_FAILED = 'REQUEST_FAILED'
export const REQUEST_ERROR_SHOWED = 'REQUEST_ERROR_SHOWED';

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

export const requestErrorShowed = () => ({
  type: REQUEST_ERROR_SHOWED
})
