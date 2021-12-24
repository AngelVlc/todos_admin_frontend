import { render, cleanup } from '@testing-library/react'
import { EditListPage } from './EditListPage'
import { AppContext } from  '../../../../shared/infrastructure/contexts';
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

const renderWithContextAndRouter = () => {
    axios.get.mockReturnValueOnce(
        {
            data: {
                id: 2,
                name: 'list name'
            }
        }
    ).mockReturnValueOnce(
        {
            data: [
                {
                    id: 5,
                    title: 'item title',
                    description: 'item description'
                }
            ]
        }
    );

    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
                    <Route path="/lists/:listId/items/:itemId/edit">
                        <EditListPage />
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

fit('should match the snapshot for an existing list', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouter();
        fragment = asFragment;
    });
    expect(fragment()).toMatchSnapshot();
});
