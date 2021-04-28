import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { RefreshTokensPage } from './RefreshTokensPage';
import { AppContext } from '../../contexts/AppContext'
import axios from 'axios';
import { act } from 'react-dom/test-utils';

afterEach(cleanup)

jest.mock('axios');

const renderWithContext = (component) => {
  axios.get.mockResolvedValue(
      {
          data: [
              { id: 1, userId: 1, expirationDate: '2021-01-29T16:46:58Z' },
              { id: 2, userId: 2, expirationDate: '2021-03-29T16:46:58Z' },
              { id: 3, userId: 1, expirationDate: '2021-04-29T16:46:58Z' }
          ]
      }
  );
  const context = { auth: { info: {} } };
  return {
      ...render(
          <AppContext.Provider value={context}>
              {component}
          </AppContext.Provider>)
  }
}

it('should match the snapshot', async () => {
  let fragment;
  await act(async () => {
      const { asFragment } = renderWithContext(<RefreshTokensPage />);
      fragment = asFragment;
  });
  expect(fragment(<RefreshTokensPage />)).toMatchSnapshot();
});

it('should select all the refresh tokens', async() => {
  let container;
  await act(async () => {
      container = renderWithContext(<RefreshTokensPage />);
  });

  await wait(() => {
      fireEvent.click(container.getByTestId('toggleSelectAll'));
  })

  expect(container.getByTestId('checkBoxItem1')).toBeChecked();
  expect(container.getByTestId('checkBoxItem2')).toBeChecked();
  expect(container.getByTestId('checkBoxItem3')).toBeChecked();
});

it('should unselect all the refresh tokens', async() => {
  let container;
  await act(async () => {
      container = renderWithContext(<RefreshTokensPage />);
  });

  await wait(() => {
      fireEvent.click(container.getByTestId('toggleSelectAll'));
      fireEvent.click(container.getByTestId('checkBoxItem1'));
      fireEvent.click(container.getByTestId('checkBoxItem2'));
      fireEvent.click(container.getByTestId('checkBoxItem3'));
  })

  expect(container.getByTestId('checkBoxItem1')).not.toBeChecked();
  expect(container.getByTestId('checkBoxItem2')).not.toBeChecked();
  expect(container.getByTestId('checkBoxItem3')).not.toBeChecked();
});

it('should unselect all the refresh tokens', async() => {
  let container;
  await act(async () => {
      container = renderWithContext(<RefreshTokensPage />);
  });

  await wait(() => {
      fireEvent.click(container.getByTestId('checkBoxItem1'));
      fireEvent.click(container.getByTestId('checkBoxItem3'));
  })

  axios.delete.mockResolvedValue({ status: 204 });

  axios.get.mockResolvedValue(
    {
        data: [
            { id: 2, userId: 2, expirationDate: '2021-03-29T16:46:58Z' },
        ]
    }
  );

  const cbItem1 = container.getByTestId('checkBoxItem1');
  const cbItem3 = container.getByTestId('checkBoxItem3');

  await wait(() => {
    fireEvent.click(container.getByTestId('deleteSelected'));
  })

  expect(axios.delete.mock.calls.length).toBe(1);
  expect(axios.delete.mock.calls[0][0]).toBe('refreshtokens');
  expect(axios.delete.mock.calls[0][1]).toStrictEqual({ data: [1,3] });
  expect(cbItem1).not.toBeInTheDocument();
  expect(container.getByTestId('checkBoxItem2')).toBeInTheDocument();
  expect(cbItem3).not.toBeInTheDocument();
});