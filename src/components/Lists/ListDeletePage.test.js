import { render, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { ListDeletePage } from './ListDeletePage'
import { AppContext } from '../../contexts/AppContext'
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils';

jest.mock('axios');
const mockHistoryGoBack = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        goBack: mockHistoryGoBack,
        push: mockHistoryPush
    })
}));

const renderWithContextAndRouter = (component) => {
    axios.get.mockResolvedValue(
        {
            data: {
                id: 2,
                name: 'ListName'
            }
        }
    );
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/lists/2/delete`]}>
                    <Route path="/lists/:listId/delete">
                        {component}
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouter(<ListDeletePage />);
        fragment = asFragment;
    });
    expect(fragment(<ListDeletePage />)).toMatchSnapshot();
});

it('should cancel the deletion', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouter(<ListDeletePage />);
    });

    await waitFor(() => {
        fireEvent.click(container.getByTestId('no'));
    })

    expect(mockHistoryGoBack.mock.calls.length).toBe(1);
    mockHistoryGoBack.mockClear();
});

it('should delete the List', async () => {
    let container
    await act(async () => {
        container = renderWithContextAndRouter(<ListDeletePage />);
    });

    axios.delete.mockResolvedValue({data:{}});

    await waitFor(() => {
        fireEvent.click(container.getByTestId('yes'));
    })

    expect(axios.delete.mock.calls.length).toBe(1);
    expect(axios.delete.mock.calls[0][0]).toBe('lists/2');
    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists');
    mockHistoryPush.mockClear();
});
