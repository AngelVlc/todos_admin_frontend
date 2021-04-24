import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { HomePage } from './HomePage'
import { AppContext } from '../../contexts/AppContext';
import { createMemoryHistory } from 'history'

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithRouterAndContext = (component, auth) => {
    const history = createMemoryHistory();
    const context = { auth };
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

it('should match the snapshot', () => {
    const { asFragment } = renderWithRouterAndContext(<HomePage />, { info: { isAdmin: false } });

    expect(asFragment(<HomePage />)).toMatchSnapshot();
})

it('should go to users when the user is an admin', async () => {
    const { getByTestId } = renderWithRouterAndContext(<HomePage />, { info: { isAdmin: true } });

    await wait(() => {
        fireEvent.click(getByTestId('users'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/users');
})

it('should go to lists', async () => {
    const { getByTestId } = renderWithRouterAndContext(<HomePage />, { info: { isAdmin: false } });

    await wait(() => {
        fireEvent.click(getByTestId('lists'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists');
})
