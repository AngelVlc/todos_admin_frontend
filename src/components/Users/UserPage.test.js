import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { UserPage } from './UserPage'
import { AppContext } from '../../contexts/AppContext'
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils';

jest.mock('axios');
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithContextAndRouterForExistingUser = (component) => {
    axios.get.mockResolvedValue(
        {
            data: {
                id: 2,
                name: 'user',
                isAdmin: false
            }
        }
    );
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
 
    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/users');
    mockHistoryPush.mockClear();
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
    await changeInputValue(container.getByTestId, 'isAdmin', 'yes');
    await changeInputValue(container.getByTestId, 'password', 'pass');
    await changeInputValue(container.getByTestId, 'confirmPassword', 'pass');

    axios.put.mockResolvedValue({data:{id: 2}});

    await wait(() => {
        fireEvent.click(container.getByTestId('submit'));
    })

    expect(axios.put.mock.calls.length).toBe(1);
    expect(axios.put.mock.calls[0][0]).toBe('users/2');
    expect(axios.put.mock.calls[0][1]).toStrictEqual({ name: 'updated user', isAdmin: true, password: 'pass', confirmPassword: 'pass' });

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/users/2/edit');
    mockHistoryPush.mockClear();
});

it('should create a new user', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewUser(<UserPage />);

    await changeInputValue(getByTestId, 'name', 'new user');
    await changeInputValue(getByTestId, 'password', 'pass');
    await changeInputValue(getByTestId, 'confirmPassword', 'pass');

    axios.post.mockResolvedValue({data:{id: 55}});

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(axios.post.mock.calls.length).toBe(1);
    expect(axios.post.mock.calls[0][0]).toBe('users');
    expect(axios.post.mock.calls[0][1]).toStrictEqual({ name: 'new user', isAdmin: false, password: 'pass', confirmPassword: 'pass' });

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/users/55/edit');
    mockHistoryPush.mockClear();
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
