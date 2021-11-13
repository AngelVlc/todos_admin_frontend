import { render, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { UserDeletePage } from './UserDeletePage'
import { AppContext } from '../../contexts/AppContext'
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils';

jest.mock('axios');
const mockHistoryGoBack = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        goBack: mockHistoryGoBack,
        push: mockHistoryPush
    })
}));

const renderWithContextAndRouter = (component, isAdmin) => {
    axios.get.mockResolvedValue(
        {
            data:
            {
                id: 2,
                name: 'user',
                isAdmin: isAdmin
            }
        }
    );
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/users/2/delete`]}>
                    <Route path="/users/:userId/delete">
                        {component}
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot when the user is not an admin', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouter(<UserDeletePage />, false);
        fragment = asFragment;
    });
    expect(fragment(<UserDeletePage />)).toMatchSnapshot();
});

it('should match the snapshot when the user is an admin', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouter(<UserDeletePage />, true);
        fragment = asFragment;
    });
    expect(fragment(<UserDeletePage />)).toMatchSnapshot();
});

it('should cancel the deletion', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouter(<UserDeletePage />, false);
    });

    await waitFor(() => {
        fireEvent.click(container.getByTestId('no'));
    })

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should delete a user', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouter(<UserDeletePage />, false);
    });

    axios.delete.mockResolvedValue({data:{}});

    await waitFor(() => {
        fireEvent.click(container.getByTestId('yes'));
    })

    expect(axios.delete.mock.calls.length).toBe(1);
    expect(axios.delete.mock.calls[0][0]).toBe('users/2');
    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/users');
    mockHistoryPush.mockClear();
});
