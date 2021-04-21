import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { HomePage } from './HomePage'
import { createMemoryHistory } from 'history'

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const renderWithRouter = (component) => {
    const history = createMemoryHistory();
    return {
        ...render(
            <Router history={history}>
                {component}
            </Router>)
    }
};

afterEach(cleanup);

it('should match the snapshot when the user is not logged in', () => {
    const { asFragment } = renderWithRouter(<HomePage />);

    expect(asFragment(<HomePage />)).toMatchSnapshot();
})

it('should go to users', async () => {
    const { getByTestId } = renderWithRouter(<HomePage />);

    await wait(() => {
        fireEvent.click(getByTestId('users'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/users');
})

it('should go to lists', async () => {
    const { getByTestId } = renderWithRouter(<HomePage />);

    await wait(() => {
        fireEvent.click(getByTestId('lists'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/lists');
})
