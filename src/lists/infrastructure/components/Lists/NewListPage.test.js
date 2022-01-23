import { render, cleanup } from '@testing-library/react'
import { ListForm } from './ListForm'
import { AppContext } from  '../../../../shared/infrastructure/contexts';
import { MemoryRouter, Route } from 'react-router-dom'

jest.mock('axios');
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithContextAndRouterForNewList = () => {
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/users/new`]}>
                    <Route path="/users/new">
                      <ListForm/>
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot for a new list', async () => {
    const { asFragment } = renderWithContextAndRouterForNewList();
    expect(asFragment()).toMatchSnapshot();
});
