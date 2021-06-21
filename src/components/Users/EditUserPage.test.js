import { render, cleanup } from '@testing-library/react'
import { EditUserPage } from './EditUserPage'
import { AppContext } from '../../contexts/AppContext'
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

const renderWithContextAndRouterForExistingUser = (component, isAdmin) => {
    axios.get.mockResolvedValue(
        {
            data: {
                id: 2,
                name: 'user',
                isAdmin: isAdmin
            }
        }
    );
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <MemoryRouter initialEntries={[`/users/2/edit`]}>
                    <Route path="/users/:userId/edit">
                        {component}
                    </Route>
                </MemoryRouter>
            </AppContext.Provider>)
    }
}

afterEach(cleanup)

it('should match the snapshot for an existing non admin user', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouterForExistingUser(<EditUserPage />, false);
        fragment = asFragment;
    });
    expect(fragment(<EditUserPage />)).toMatchSnapshot();
});

it('should match the snapshot for an existing admin user', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouterForExistingUser(<EditUserPage />, true);
        fragment = asFragment;
    });
    expect(fragment(<EditUserPage />)).toMatchSnapshot();
});
