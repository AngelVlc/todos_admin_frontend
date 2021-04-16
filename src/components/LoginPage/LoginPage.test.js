import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { LoginPage } from './LoginPage'
import axios from 'axios';

jest.mock('axios');

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
}

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

it('should match the snapshot', () => {
    const { asFragment } = renderWithRouter(<LoginPage />);

    expect(asFragment(<LoginPage />)).toMatchSnapshot();
});

it('should require user name and password for logging in', async () => {
    const { getByTestId } = renderWithRouter(<LoginPage />);

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(getByTestId('userNameErrors')).toHaveTextContent('Required');
    expect(getByTestId('passwordErrors')).toHaveTextContent('Required');
})

it('should show the error when log in fails', async () => {
    const { getByTestId } = renderWithRouter(<LoginPage />);

    await changeInput(getByTestId, 'userName', 'user');
    await changeInput(getByTestId, 'password', 'pass');

    axios.post.mockRejectedValue('some error');

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(axios.post.mock.calls.length).toBe(1);
    expect(axios.post.mock.calls[0][0]).toBe('/auth/login');
    expect(axios.post.mock.calls[0][1]).toStrictEqual({userName: 'user', password: 'pass'});
    expect(getByTestId('authError')).toHaveTextContent('some error');
    axios.post.mockClear();
})

it('should show the home page after logging in', async () => {
    const { getByTestId } = renderWithRouter(<LoginPage />);

    await changeInput(getByTestId, 'userName', 'user');
    await changeInput(getByTestId, 'password', 'pass');

    axios.post.mockResolvedValue({
        data: {
            userId: 1,
            userName: 'userName',
            isAdmin: true
        }
    });

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    });

    expect(axios.post.mock.calls.length).toBe(1);
    expect(axios.post.mock.calls[0][0]).toBe('/auth/login');
    expect(axios.post.mock.calls[0][1]).toStrictEqual({ password: "pass", userName: "user" });
    expect(window.localStorage.setItem.mock.calls.length).toBe(1);
    expect(window.localStorage.setItem.mock.calls[0][0]).toBe('userInfo');
    expect(window.localStorage.setItem.mock.calls[0][1]).toBe(JSON.stringify({ userId: 1, userName: 'userName', isAdmin: true}));
    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/');
    axios.post.mockClear();
})

const changeInput = async (getByTestId, name, value) => {
    await wait(() => {
        fireEvent.change(getByTestId(name), {
            target: {
                value: value
            }
        })
    })
};
