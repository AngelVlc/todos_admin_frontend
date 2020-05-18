import React from 'react'
import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { LoginPage } from './LoginPage'
import { AppContext } from '../../contexts/AppContext'
import * as api from '../../helpers/api';
import jwt from 'jwt-decode';

jest.mock('jwt-decode');
jest.mock('../../helpers/api');
const mockAuthDispatch = jest.fn()
const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithContextAndRouter = (component) => {
    const history = createMemoryHistory();
    const context = { authDispatch: mockAuthDispatch };

    return {
        ...render(
            <AppContext.Provider value={context}>
                <Router history={history}>
                    {component}
                </Router>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot', () => {
    const { asFragment } = renderWithContextAndRouter(<LoginPage />);

    expect(asFragment(<LoginPage />)).toMatchSnapshot();
});

it('should require user name and password for logging in', async () => {
    const { getByTestId } = renderWithContextAndRouter(<LoginPage />);

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(getByTestId('userNameErrors')).toHaveTextContent('Required');
    expect(getByTestId('passwordErrors')).toHaveTextContent('Required');
})

it('should show the error when log in fails', async () => {
    const { getByTestId } = renderWithContextAndRouter(<LoginPage />);

    await changeInput(getByTestId, 'userName', 'user');
    await changeInput(getByTestId, 'password', 'pass');

    api.doGetToken.mockRejectedValue('some error');

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(api.doGetToken.mock.calls.length).toBe(1);
    expect(getByTestId('authError')).toHaveTextContent('some error');
    api.doGetToken.mockClear();
})

it('should show the home page after logging in', async () => {
    const { getByTestId } = renderWithContextAndRouter(<LoginPage />);

    await changeInput(getByTestId, 'userName', 'user');
    await changeInput(getByTestId, 'password', 'pass');

    api.doGetToken.mockResolvedValue({
        'refreshToken': 'theRefreshToken',
        'token': 'theToken'
    });

    jwt.mockReturnValue({
        exp: 'exp',
        userId: 10,
        userName: 'user',
        isAdmin: true
    });

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    const userLoggedIn = {
        type: 'USER_LOGGED_IN',
        authInfo: {
            exp: 'exp',
            token: 'theToken',
            refreshToken: 'theRefreshToken',
            userName: 'user',
            userId: 10,
            isAdmin: true
        }
    }
    expect(api.doGetToken.mock.calls.length).toBe(1);
    expect(api.doGetToken.mock.calls[0][0]).toStrictEqual({ "password": "pass", "userName": "user" });
    expect(mockAuthDispatch.mock.calls.length).toBe(1);
    expect(mockAuthDispatch.mock.calls[0][0]).toStrictEqual(userLoggedIn);
    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/');
    api.doGetToken.mockClear();
})

const changeInput = async (getByTestId, name, value) => {
    await wait(() => {
        fireEvent.change(getByTestId(name), {
            target: {
                value: value
            }
        })
    })

}
