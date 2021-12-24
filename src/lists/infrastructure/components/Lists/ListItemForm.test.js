import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { ListItemForm } from './ListItemForm';
import { AppContext } from  '../../../../shared/infrastructure/contexts';
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

jest.mock('axios');
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithContextAndRouterForExistingItem = () => {
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
                    <Route path="/lists/:listId/items/:itemId/edit">
                        <ListItemForm listId={2} itemId={5} title='item title' description='item description' isNew={false} submintBtnText='SAVE' submitUrl='lists/2/items/5'/>
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

const renderWithContextAndRouterForNewItem = () => {
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/lists/2/items/new`]}>
                    <Route path="/lists/:listId/items/new">
                    <ListItemForm listId={2} isNew={true} submintBtnText='CREATE' submitUrl='lists/2/items'/>
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot for an existing item', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouterForExistingItem();
        fragment = asFragment;
    });
    expect(fragment()).toMatchSnapshot();
});

it('should match the snapshot for a new item', async () => {
    const { asFragment } = renderWithContextAndRouterForNewItem();
    expect(asFragment()).toMatchSnapshot();
});

it('should allow delete an existing item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingItem();
    });

    await waitFor(() => {
        fireEvent.click(container.getByTestId('delete'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/2/items/5/delete');
    mockHistoryPush.mockClear();
});

it('should allow cancel', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewItem();

    await waitFor(() => {
        fireEvent.click(getByTestId('cancel'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/2/edit');
    mockHistoryPush.mockClear();
});

it('should require item title', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewItem();

    await waitFor(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(getByTestId('titleErrors')).toHaveTextContent('Required');
})

it('should update an existing item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingItem();
    });

    await changeInputValue(container.getByTestId, 'title', 'updated title');
    await changeInputValue(container.getByTestId, 'description', 'updated description');

    axios.put.mockResolvedValue({data:{}});

    await waitFor(() => {
        fireEvent.click(container.getByTestId('submit'));
    })

    expect(axios.put.mock.calls.length).toBe(1);
    expect(axios.put.mock.calls[0][0]).toBe('lists/2/items/5');
    expect(axios.put.mock.calls[0][1]).toStrictEqual({ title: 'updated title', description: 'updated description' });

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/2/edit');
    mockHistoryPush.mockClear();
});

it('should create a new item', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewItem();

    await changeInputValue(getByTestId, 'title', 'title');
    await changeInputValue(getByTestId, 'description', 'description');

    axios.post.mockResolvedValue({data:{}});

    await waitFor(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(axios.post.mock.calls.length).toBe(1);
    expect(axios.post.mock.calls[0][0]).toBe('lists/2/items');
    expect(axios.post.mock.calls[0][1]).toStrictEqual({ title: 'title', description: 'description' });

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/2/edit');
    mockHistoryPush.mockClear();
});

const changeInputValue = async (getByTestId, name, value) => {
    await waitFor(() => {
        fireEvent.change(getByTestId(name), {
            target: {
                value: value
            }
        })
    })
}
