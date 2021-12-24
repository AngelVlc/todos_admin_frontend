import { render, cleanup } from '@testing-library/react'
import { NewListItemPage } from './NewListItemPage';
import { AppContext } from '../../shared/infrastructure/contexts/AppContext';
import { MemoryRouter, Route } from 'react-router-dom';

jest.mock('axios');
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithContextAndRouterForNewItem = () => {
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/lists/2/items/new`]}>
                    <Route path="/lists/:listId/items/new">
                        <NewListItemPage/>
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot for a new item', async () => {
    const { asFragment } = renderWithContextAndRouterForNewItem();
    expect(asFragment()).toMatchSnapshot();
});
