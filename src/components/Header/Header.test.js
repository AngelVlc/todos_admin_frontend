import React from 'react'
import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { Header } from './Header'
import { AppContext } from '../../contexts/AppContext'

const mockAuthDispatch = jest.fn()

const renderWithContext = (component, auth) => {
    const context = { authDispatch: mockAuthDispatch, auth }
    return {
        ...render(
            <AppContext.Provider value={context}>
                {component}
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot when the user is not logged in', () => {
    const { asFragment } = renderWithContext(<Header />, { info: null });

    expect(asFragment(<Header />)).toMatchSnapshot();
})

it('should match the snapshot when the user is logged in', () => {
    const { asFragment } = renderWithContext(<Header />, { info: { userName: 'user' } });

    expect(asFragment(<Header />)).toMatchSnapshot();
})

it('should do logout', async () => {
    const { getByTestId } = renderWithContext(<Header />, { info: { userName: 'user' } });

    await wait(() => {
        fireEvent.click(getByTestId('logOut'));
    })

    expect(mockAuthDispatch.mock.calls.length).toBe(1);
    const userLoggedIn = {
        type: 'USER_LOGGED_OUT'
    }
    expect(mockAuthDispatch.mock.calls[0][0]).toStrictEqual(userLoggedIn);
})