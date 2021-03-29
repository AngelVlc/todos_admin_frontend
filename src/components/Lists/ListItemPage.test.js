import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { ListItemPage } from './ListItemPage'
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

const renderWithContextAndRouterForExistingItem = (component) => {
    api.doGet.mockResolvedValue({
        id: 2,
        title: 'item title',
        description: 'item description'
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

const renderWithContextAndRouterForNewItem = (component) => {
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/lists/2/items/new`]}>
                    <Route path="/lists/:listId/items/new">
                        {component}
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot for an existing item', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouterForExistingItem(<ListItemPage />);
        fragment = asFragment;
    });
    expect(fragment(<ListItemPage />)).toMatchSnapshot();
});

it('should match the snapshot for a new item', async () => {
    const { asFragment } = renderWithContextAndRouterForNewItem(<ListItemPage />);
    expect(asFragment(<ListItemPage />)).toMatchSnapshot();
});

it('should allow delete an existing item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingItem(<ListItemPage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('delete'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/2/items/5/delete');
    mockHistoryPush.mockClear();
});

it('should allow cancel', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewItem(<ListItemPage />);

    await wait(() => {
        fireEvent.click(getByTestId('cancel'));
    })

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should require item title', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewItem(<ListItemPage />);

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(getByTestId('titleErrors')).toHaveTextContent('Required');
})

it('should update an existing item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingItem(<ListItemPage />);
    });

    await changeInputValue(container.getByTestId, 'title', 'updated title');
    await changeInputValue(container.getByTestId, 'description', 'updated description');

    api.doPut.mockResolvedValue({});

    await wait(() => {
        fireEvent.click(container.getByTestId('submit'));
    })

    expect(api.doPut.mock.calls.length).toBe(1);
    expect(api.doPut.mock.calls[0][0]).toBe('lists/2/items/5');
    expect(api.doPut.mock.calls[0][1]).toStrictEqual({ title: 'updated title', description: 'updated description' });

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should create a new item', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewItem(<ListItemPage />);

    await changeInputValue(getByTestId, 'title', 'title');
    await changeInputValue(getByTestId, 'description', 'description');

    api.doPost.mockResolvedValue({});

    await wait(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(api.doPost.mock.calls.length).toBe(1);
    expect(api.doPost.mock.calls[0][0]).toBe('lists/2/items');
    expect(api.doPost.mock.calls[0][1]).toStrictEqual({ title: 'title', description: 'description' });

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

