import { requestStarted, requestDone, requestFailed, requestErrorShowed } from './';

test('should generate request pending action', () => {
    const action = requestStarted();

    expect(action).toEqual({
        type: 'REQUEST_STARTED'
    })
})

test('should generate request done action', () => {
    const action = requestDone();

    expect(action).toEqual({
        type: 'REQUEST_DONE'
    })
})

test('should generate request failed action', () => {
    const action = requestFailed();

    expect(action).toEqual({
        type: 'REQUEST_FAILED'
    })
})

test('should generate request error showed action', () => {
    const action = requestErrorShowed();

    expect(action).toEqual({
        type: 'REQUEST_ERROR_SHOWED'
    })
})
