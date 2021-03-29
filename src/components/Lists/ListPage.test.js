import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { ListPage } from './ListPage'
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

const renderWithContextAndRouterForExistingList = (component) => {
    api.doGet.mockResolvedValue({
        id: 2,
        name: 'list name',
        items: [
            {
                id: 5,
                title: 'item title',
                description: 'item description'
            }
        ]
    });
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
                    <Route path="/lists/:listId/items/:itemId/edit">
                        {component}
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

const renderWithContextAndRouterForNewList = (component) => {
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

it('should match the snapshot for an existing list', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouterForExistingList(<ListPage />);
        fragment = asFragment;
    });
    expect(fragment(<ListPage />)).toMatchSnapshot();
});

it('should match the snapshot for a new list', async () => {
    const { asFragment } = renderWithContextAndRouterForNewList(<ListPage />);
    expect(asFragment(<ListPage />)).toMatchSnapshot();
});

it('should allow delete an existing list', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList(<ListPage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('delete'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/2/delete');
    mockHistoryPush.mockClear();
});

it('should allow cancel', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewList(<ListPage />);

    await wait(() => {
        fireEvent.click(getByTestId('cancel'));
    })

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should require list name', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewList(<ListPage />);

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(getByTestId('nameErrors')).toHaveTextContent('Required');
})

it('should update an existing list', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList(<ListPage />);
    });

    await changeInputValue(container.getByTestId, 'name', 'updated name');

    api.doPut.mockResolvedValue({});

    await wait(() => {
        fireEvent.click(container.getByTestId('submit'));
    })

    expect(api.doPut.mock.calls.length).toBe(1);
    expect(api.doPut.mock.calls[0][0]).toBe('lists/2');
    expect(api.doPut.mock.calls[0][1]).toStrictEqual({ name: 'updated name' });

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should create a new list', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewList(<ListPage />);

    await changeInputValue(getByTestId, 'name', 'new list');

    api.doPost.mockResolvedValue({});

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(api.doPost.mock.calls.length).toBe(1);
    expect(api.doPost.mock.calls[0][0]).toBe('lists');
    expect(api.doPost.mock.calls[0][1]).toStrictEqual({ name: 'new list' });

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should add a new item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList(<ListPage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('addNew'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/2/items/new');
    mockHistoryPush.mockClear();
});

it('should update an existing item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList(<ListPage />);
    });

    expect(container.getByTestId('editListItem5').href).toBe('http://localhost/lists/2/items/5/edit');
});

it('should allow delete an existing item item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList(<ListPage />);
    });

    expect(container.getByTestId('deleteListItem5').href).toBe('http://localhost/lists/2/items/5/delete');
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
