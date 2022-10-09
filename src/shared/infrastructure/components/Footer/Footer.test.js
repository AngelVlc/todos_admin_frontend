import { render, cleanup } from '@testing-library/react';
import { Footer } from './Footer';

const renderComponent = () => {
  return {
    ...render(
      <Footer/>
    ),
  };
};

afterEach(cleanup);

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

it("Should match the snapshot", () => {
  process.env.REACT_APP_COMMIT_SHA = 'sha'
  process.env.REACT_APP_BUILD_DATE = 'date'

  const { asFragment } = renderComponent();

  expect(asFragment(<Footer />)).toMatchSnapshot();
});
