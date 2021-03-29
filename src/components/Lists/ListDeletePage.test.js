import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { ListDeletePage } from './ListDeletePage'
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

const renderWithContextAndRouter = (component) => {
    api.doGet.mockResolvedValue({
        id: 2,
        name: 'ListName'
    });
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

    await wait(() => {
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

    api.doDelete.mockResolvedValue({});

    await wait(() => {
        fireEvent.click(container.getByTestId('yes'));
    })

    expect(api.doDelete.mock.calls.length).toBe(1);
    expect(api.doDelete.mock.calls[0][0]).toBe('lists/2');
    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists');
    mockHistoryPush.mockClear();
});
