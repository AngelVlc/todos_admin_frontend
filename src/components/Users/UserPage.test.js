import React from 'react'
import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { UserPage } from './UserPage'
import { AppContext } from '../../contexts/AppContext'
import * as api from '../../helpers/api';
import { MemoryRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils';

jest.mock('../../helpers/api');
const mockHistoryGoBack = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        goBack: mockHistoryGoBack,
        push: mockHistoryPush
    })
}));

const renderWithContextAndRouterForExistingUser = (component) => {
    api.doGet.mockResolvedValue({
        id: 2,
        name: 'user',
        isAdmin: false
    });
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/users/2/edit`]}>
                    <Route path="/users/:userId/edit">
                        {component}
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

const renderWithContextAndRouterForNewUser = (component) => {
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/users/new`]}>
                    <Route path="/users/new">
                        {component}
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot for an existing user', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouterForExistingUser(<UserPage />);
        fragment = asFragment;
    });
    expect(fragment(<UserPage />)).toMatchSnapshot();
});

it('should match the snapshot for a new user', async () => {
    const { asFragment } = renderWithContextAndRouterForNewUser(<UserPage />);
    expect(asFragment(<UserPage />)).toMatchSnapshot();
});

it('should allow delete an existing user', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingUser(<UserPage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('delete'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/users/2/delete');
    mockHistoryPush.mockClear();
});

it('should allow cancel', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewUser(<UserPage />);

    await wait(() => {
        fireEvent.click(getByTestId('cancel'));
    })

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should require user name', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewUser(<UserPage />);

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(getByTestId('userNameErrors')).toHaveTextContent('Required');
})

it('should update an existing user', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingUser(<UserPage />);
    });

    await changeInputValue(container.getByTestId, 'name', 'updated user');
    await changeInputValue(container.getByTestId, 'isAdmin', true);
    await changeInputValue(container.getByTestId, 'newPassword', 'pass');
    await changeInputValue(container.getByTestId, 'confirmNewPassword', 'pass');

    api.doPut.mockResolvedValue({});

    await wait(() => {
        fireEvent.click(container.getByTestId('submit'));
    })

    expect(api.doPut.mock.calls.length).toBe(1);
    expect(api.doPut.mock.calls[0][0]).toBe('users/2');
    expect(api.doPut.mock.calls[0][1]).toStrictEqual({ name: 'updated user', isAdmin: true, newPassword: 'pass', confirmNewPassword: 'pass' });

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should create a new user', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewUser(<UserPage />);

    await changeInputValue(getByTestId, 'name', 'new user');
    await changeInputValue(getByTestId, 'newPassword', 'pass');
    await changeInputValue(getByTestId, 'confirmNewPassword', 'pass');

    api.doPost.mockResolvedValue({});

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(api.doPost.mock.calls.length).toBe(1);
    expect(api.doPost.mock.calls[0][0]).toBe('users');
    expect(api.doPost.mock.calls[0][1]).toStrictEqual({ name: 'new user', isAdmin: false, newPassword: 'pass', confirmNewPassword: 'pass' });

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

const changeInputValue = async (getByTestId, name, value) => {
    await wait(() => {
        fireEvent.change(getByTestId(name), {
            target: {
                value: value
            }
        })
    })
}
