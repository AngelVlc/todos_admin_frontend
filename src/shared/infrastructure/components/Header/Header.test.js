import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Header } from './Header';
import { AppContext } from '../../contexts';
import { createMemoryHistory } from 'history';

const mockAuthDispatch = jest.fn()
const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithRouterAndContext = (component, auth) => {
    const history = createMemoryHistory();
    const context = { authDispatch: mockAuthDispatch, auth };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <Router history={history}>
                    {component}
                </Router>
            </AppContext.Provider>)
    }
};

afterEach(cleanup);

it('should match the snapshot when the user is not logged in', () => {
    const { asFragment } = renderWithRouterAndContext(<Header />, { info: null });

    expect(asFragment(<Header />)).toMatchSnapshot();
})

it('should match the snapshot when the user is logged in', () => {
    const { asFragment } = renderWithRouterAndContext(<Header />, { info: { userName: 'user' } });

    expect(asFragment(<Header />)).toMatchSnapshot();
})

it('should match the snapshot when an admin user is logged in', () => {
    const { asFragment } = renderWithRouterAndContext(<Header />, { info: { userName: 'admin', isAdmin: true } });

    expect(asFragment(<Header />)).toMatchSnapshot();
})

it('should do logout', async () => {
    const { getByTestId } = renderWithRouterAndContext(<Header />, { info: { userName: 'user' } });

    await waitFor(() => {
        fireEvent.click(getByTestId('logOut'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/login');
})

it('should go to root', async () => {
    const { getByTestId } = renderWithRouterAndContext(<Header />, { info: { userName: 'user' } });

    await waitFor(() => {
        fireEvent.click(getByTestId('goToRoot'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/');
})

it('should go to lists', async () => {
    const { getByTestId } = renderWithRouterAndContext(<Header />, { info: { userName: 'user' } });

    await waitFor(() => {
        fireEvent.click(getByTestId('goToLists'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists');
})

it('should go to users', async () => {
    const { getByTestId } = renderWithRouterAndContext(<Header />, { info: { userName: 'user', isAdmin: true } });

    await waitFor(() => {
        fireEvent.click(getByTestId('goToUsers'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/users');
})
