import React from 'react'
import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { UserDeletePage } from './UserDeletePage'
import { AppContext } from '../../contexts/AppContext'
import * as api from '../../helpers/api';
import { MemoryRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils';

jest.mock('../../helpers/api');
const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        goBack: mockHistoryGoBack
    })
}));

const renderWithContextAndRouter = (component) => {
    api.doGet.mockResolvedValue({
        id: 2,
        name: 'user',
        isAdmin: false
    });
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/user/2/delete`]}>
                    <Route path="/user/:userId/delete">
                        {component}
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouter(<UserDeletePage />);
        fragment = asFragment;
    });
    expect(fragment(<UserDeletePage />)).toMatchSnapshot();
});

it('should cancel the deletion', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouter(<UserDeletePage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('no'));
    })

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should delete the user', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouter(<UserDeletePage />);
    });

    api.doDelete.mockResolvedValue({});

    await wait(() => {
        fireEvent.click(container.getByTestId('yes'));
    })

    expect(api.doDelete.mock.calls.length).toBe(1);
    expect(api.doDelete.mock.calls[0][0]).toBe('users/2');
    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});
