import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { HomePage } from "./HomePage";
import { AppContext } from "../../contexts";
import { createMemoryHistory } from "history";

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithRouterAndContext = (auth) => {
  const history = createMemoryHistory();
  const context = { auth };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <Router history={history}>{<HomePage />}</Router>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("HomePage", () => {
  describe("when the user is an admin", () => {
    it("should match the snapshot", () => {
      const { asFragment } = renderWithRouterAndContext({
        info: { isAdmin: true },
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it("should allow to go to users", async () => {
      const { getByTestId } = renderWithRouterAndContext({
        info: { isAdmin: true },
      });

      await waitFor(() => {
        fireEvent.click(getByTestId("users"));
      });

      expect(mockHistoryPush).toHaveBeenCalled();
      expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
    });

    it("should allow to go to refresh tokens", async () => {
      const { getByTestId } = renderWithRouterAndContext({
        info: { isAdmin: true },
      });

      await waitFor(() => {
        fireEvent.click(getByTestId("refreshTokens"));
      });

      expect(mockHistoryPush).toHaveBeenCalled();
      expect(mockHistoryPush.mock.calls[0][0]).toBe("/refreshtokens");
    });

    it("should allow to go to lists", async () => {
      const { getByTestId } = renderWithRouterAndContext({
        info: { isAdmin: true },
      });

      await waitFor(() => {
        fireEvent.click(getByTestId("lists"));
      });

      expect(mockHistoryPush).toHaveBeenCalled();
      expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists");
    });
  });

  describe("when the user is not an admin", () => {
    it("should match the snapshot", () => {
      const { asFragment } = renderWithRouterAndContext({
        info: { isAdmin: false },
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it("should allow to go to lists", async () => {
      const { getByTestId } = renderWithRouterAndContext({
        info: { isAdmin: false },
      });

      await waitFor(() => {
        fireEvent.click(getByTestId("lists"));
      });

      expect(mockHistoryPush).toHaveBeenCalled();
      expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists");
    });
  });
});
