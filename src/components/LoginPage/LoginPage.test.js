import React from 'react'
import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { LoginPage } from './LoginPage'
import { AppContext } from '../../contexts/AppContext'
import * as api from '../../helpers/api';
import jwt from 'jwt-decode';

jest.mock('jwt-decode');
const mockAuthDispatch = jest.fn()

const renderWithContextAndRouter = (component) => {
    const history = createMemoryHistory()
    const context = { authDispatch: mockAuthDispatch }
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

it('should take a snapshot', () => {
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

    await wait(() => {
        fireEvent.change(getByTestId('userName'), {
            target: {
                value: "user"
            }
        })
    })

    await wait(() => {
        fireEvent.change(getByTestId('password'), {
            target: {
                value: "pass"
            }
        })
    })

    api.doGetToken = jest.fn((loginDto, requestDispatch) => {
        return Promise.reject('some error');
    });

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(getByTestId('authError')).toHaveTextContent('some error');
})


it('should show the home page after logging in', async () => {
    const { container, getByTestId } = renderWithContextAndRouter(<LoginPage />);

    await wait(() => {
        fireEvent.change(getByTestId('userName'), {
            target: {
                value: 'user'
            }
        })
    })

    await wait(() => {
        fireEvent.change(getByTestId('password'), {
            target: {
                value: 'pass'
            }
        })
    })

    api.doGetToken = jest.fn((loginDto, requestDispatch) => {
        const tokens = {
            'refreshToken': 'theRefreshToken',
            'token': 'theToken'
        }
        return Promise.resolve(tokens);
    });

    jwt.mockImplementation(() => {
        return {
            exp: 'exp',
            userId: 10,
            userName: 'user'
        }
    })

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(mockAuthDispatch.mock.calls.length).toBe(1);
    const userLoggedIn = {
        type: 'USER_LOGGED_IN',
        authInfo: {
            exp: 'exp',
            token: 'theToken',
            refreshToken: 'theRefreshToken',
            userName: 'user',
            userId: 10
        }
    }
    expect(mockAuthDispatch.mock.calls[0][0]).toStrictEqual(userLoggedIn);
    expect(location.pathname).toBe("/");
})
