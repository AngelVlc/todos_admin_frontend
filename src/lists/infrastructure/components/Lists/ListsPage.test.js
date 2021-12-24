import { render, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { ListsPage } from './ListsPage'
import { AppContext } from  '../../../../shared/infrastructure/contexts';
import { createMemoryHistory } from 'history'
import axios from 'axios';
import { Router } from 'react-router-dom'
import { act } from 'react-dom/test-utils';

afterEach(cleanup)

jest.mock('axios');
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const history = createMemoryHistory();

const renderWithContextAndRouter = (component) => {
    axios.get.mockResolvedValue(
        {
            data: [
                { id: 1, name: 'user1', itemsCount: 4 },
                { id: 2, name: 'user2', itemsCount: 6 }
            ]
        }
    );
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <Router history={history}>
                    {component}
                </Router>
            </AppContext.Provider>)
    }
}

it('should match the snapshot', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouter(<ListsPage />);
        fragment = asFragment;
    });
    expect(fragment(<ListsPage />)).toMatchSnapshot();
});

it('should add a new list', async () => {
    let container;
    await act(async () => {
        container = renderWithContextAndRouter(<ListsPage />);
    });

    await waitFor(() => {
        fireEvent.click(container.getByTestId('addNew'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists/new');
    mockHistoryPush.mockClear();
});

it('should edit the list', async () => {
    let container;
    await act(async () => {
        container = renderWithContextAndRouter(<ListsPage />);
    });

    await waitFor(() => {
        fireEvent.click(container.getByTestId('editList2'));
    })

    expect(history.location.pathname).toBe('/lists/2/edit');
});

it('should delete the list', async () => {
    let container;
    await act(async () => {
        container = renderWithContextAndRouter(<ListsPage />);
    });

    await waitFor(() => {
        fireEvent.click(container.getByTestId('deleteList2'));
    })

    expect(history.location.pathname).toBe('/lists/2/delete');
});
