import { render, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { ListForm } from './ListForm'
import { AppContext } from  '../../../../shared/infrastructure/contexts/AppContext';
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils';
import {
    mockGetComputedStyle,
    mockDndSpacing,
    makeDnd,
    DND_DIRECTION_DOWN,
  } from 'react-beautiful-dnd-test-utils';

jest.mock('axios');
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithContextAndRouterForExistingList = () => {
    const items = [
                {
                    id: 5,
                    title: 'item 5 title',
                    description: 'item 5 description'
                },
                {
                    id: 6,
                    title: 'item 6 title',
                    description: 'item 6 description'
                }
            ]

    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
                    <Route path="/lists/:listId/items/:itemId/edit">
                      <ListForm listId={2} name='list name' items={items} isNew={false} submintBtnText='SAVE' submitUrl={'lists/2'}/>
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

const renderWithContextAndRouterForNewList = () => {
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/users/new`]}>
                    <Route path="/users/new">
                      <ListForm name='' items={[]} isNew={true} submintBtnText='CREATE' submitUrl={'lists'}/>
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

beforeEach(() => {
    mockGetComputedStyle();
});

afterEach(cleanup)

it('should match the snapshot for an existing list', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouterForExistingList();
        fragment = asFragment;
    });
    expect(fragment()).toMatchSnapshot();
});

it('should match the snapshot for a new list', async () => {
    const { asFragment } = renderWithContextAndRouterForNewList();
    expect(asFragment()).toMatchSnapshot();
});

it('should allow delete an existing list', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList();
    });

    await waitFor(() => {
        fireEvent.click(container.getByTestId('delete'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/2/delete');
    mockHistoryPush.mockClear();
});

it('should allow cancel', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewList();

    await waitFor(() => {
        fireEvent.click(getByTestId('cancel'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists');
    mockHistoryPush.mockClear();
});

it('should require list name', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewList();

    await waitFor(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(getByTestId('nameErrors')).toHaveTextContent('Required');
})

it('should update an existing list', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList();
        mockDndSpacing(container.container);
    });

    await makeDnd({
        getDragElement: () => container.getByTestId('draggable5'),
        direction: DND_DIRECTION_DOWN,
        positions: 1
    });

    await changeInputValue(container.getByTestId, 'name', 'updated name');

    axios.put.mockResolvedValue({ data: {id: 2} });

    await waitFor(() => {
        fireEvent.click(container.getByTestId('submit'));
    })

    expect(axios.put.mock.calls.length).toBe(1);
    expect(axios.put.mock.calls[0][0]).toBe('lists/2');
    expect(axios.put.mock.calls[0][1]).toStrictEqual({ name: 'updated name', idsByPosition: [6, 5] });
});

it('should create a new list', async () => {
    const { getByTestId } = renderWithContextAndRouterForNewList();

    await changeInputValue(getByTestId, 'name', 'new list');

    axios.post.mockResolvedValue({ data: {id: 55} });

    await waitFor(() => {
        fireEvent.click(getByTestId('submit'));
    })

    expect(axios.post.mock.calls.length).toBe(1);
    expect(axios.post.mock.calls[0][0]).toBe('lists');
    expect(axios.post.mock.calls[0][1]).toStrictEqual({ name: 'new list' });

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/55/edit');
    mockHistoryPush.mockClear();
});

it('should add a new item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList();
    });

    await waitFor(() => {
        fireEvent.click(container.getByTestId('addNew'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/2/items/new');
    mockHistoryPush.mockClear();
});

it('should update an existing item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList();
    });

    expect(container.getByTestId('editListItem5').href).toBe('http://localhost/lists/2/items/5/edit');
});

it('should allow delete an existing item item', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouterForExistingList();
    });

    expect(container.getByTestId('deleteListItem5').href).toBe('http://localhost/lists/2/items/5/delete');
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
