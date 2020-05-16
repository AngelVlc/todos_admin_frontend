import React from 'react'
import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { HomePage } from './HomePage'
import { AppContext } from '../../contexts/AppContext'
import { createMemoryHistory } from 'history'
import * as api from '../../helpers/api';
import { Router } from 'react-router-dom'
import { act } from 'react-dom/test-utils';

jest.mock('../../helpers/api');
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const history = createMemoryHistory();

const renderWithContextAndRouter = (component) => {
    api.doGet.mockResolvedValue(
        [
            { id: 1, name: 'user1', isAdmin: true },
            { id: 2, name: 'user2', isAdmin: false }
        ]
    );
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <Router history={history}>
                    {component}
                </Router>
            </AppContext.Provider>)
    }
}

it('should match the snapshot', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouter(<HomePage />);
        fragment = asFragment;
    });
    expect(fragment(<HomePage />)).toMatchSnapshot();
});

it('should add a new user', async () => {
    let container;
    await act(async () => {
        container = renderWithContextAndRouter(<HomePage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('addNew'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('user/new');
    mockHistoryPush.mockClear();
});

it('should edit the user', async () => {
    let container;
    await act(async () => {
        container = renderWithContextAndRouter(<HomePage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('editUser2'));
    })

    expect(history.location.pathname).toBe('/user/2/edit');
});

it('should delete the user', async () => {
    let container;
    await act(async () => {
        container = renderWithContextAndRouter(<HomePage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('deleteUser2'));
    })

    expect(history.location.pathname).toBe('/user/2/delete');
});
