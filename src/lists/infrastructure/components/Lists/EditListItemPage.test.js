import { render, cleanup } from '@testing-library/react';
import { EditListItemPage } from './EditListItemPage';
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
    axios.get.mockResolvedValue(
        {
            data:
            {
                id: 2,
                title: 'item title',
                description: 'item description'
            }
        }
    );
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/lists/2/items/5/edit`]}>
                    <Route path="/lists/:listId/items/:itemId/edit">
                        <EditListItemPage/>
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
