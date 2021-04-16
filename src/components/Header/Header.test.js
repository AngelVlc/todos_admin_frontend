import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { Header } from './Header'
import { createMemoryHistory } from 'history'

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithRouter = (component) => {
    const history = createMemoryHistory();
    return {
        ...render(
            <Router history={history}>
                {component}
            </Router>)
    }
};

beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null)
        },
        writable: true
    });
});

afterEach(cleanup);

it('should match the snapshot when the user is not logged in', () => {
    localStorage.getItem.mockReturnValue(null);
    const { asFragment } = renderWithRouter(<Header />);

    expect(asFragment(<Header />)).toMatchSnapshot();
})

it('should match the snapshot when the user is logged in', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ userName: 'user' }));
    const { asFragment } = renderWithRouter(<Header />);

    expect(asFragment(<Header />)).toMatchSnapshot();
})

it('should match the snapshot when an admin user is logged in', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ userName: 'admin', isAdmin: true }));
    const { asFragment } = renderWithRouter(<Header />);

    expect(asFragment(<Header />)).toMatchSnapshot();
})

it('should do logout', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ userName: 'user' }));
    const { getByTestId } = renderWithRouter(<Header />);

    await wait(() => {
        fireEvent.click(getByTestId('logOut'));
    })

    expect(window.localStorage.setItem.mock.calls.length).toBe(1);
    expect(window.localStorage.setItem.mock.calls[0][0]).toBe('userInfo');
    expect(window.localStorage.setItem.mock.calls[0][1]).toBe(null);
    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/login');
})
