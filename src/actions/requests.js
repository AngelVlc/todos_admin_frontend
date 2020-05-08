export const REQUEST_PENDING = 'REQUEST_PENDING';
export const REQUEST_DONE = 'REQUEST_DONE';

export const requestPending = () => ({
  type: REQUEST_PENDING
})

export const requestDone = () => ({
  type: REQUEST_DONE
})
