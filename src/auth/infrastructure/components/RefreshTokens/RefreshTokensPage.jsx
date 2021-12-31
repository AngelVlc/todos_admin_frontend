import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import {
  GetRefreshTokensUseCase,
  DeleteSelectedRefreshTokensUseCase,
} from "../../../application/refreshTokens";

export const RefreshTokensPage = () => {
  const [tokens, setTokens] = useState([]);
  const { useCaseFactory } = useContext(AppContext);

  const getRefreshTokens = useCallback(async () => {
    const getRefreshTokensUseCase = useCaseFactory.get(GetRefreshTokensUseCase);
    const refreshTokens = await getRefreshTokensUseCase.execute();

    setTokens(refreshTokens);
  }, [useCaseFactory]);

  useEffect(() => {
    getRefreshTokens();
  }, [getRefreshTokens]);

  const onSelectAll = (newValue) => {
    const data = [...tokens].map((token) => {
      token.selected = newValue;
      return token;
    });

    setTokens(data);
  };

  const onChangeItemSelected = (newValue, index) => {
    const data = [...tokens];
    data[index].selected = newValue;

    setTokens(data);
  };

  const onDeleteSelectedTokens = async () => {
    const deleteSelectedRefreshTokensUseCase = useCaseFactory.get(DeleteSelectedRefreshTokensUseCase);
    const ok = await deleteSelectedRefreshTokensUseCase.execute(tokens);
    if (ok) {
      getRefreshTokens();
    }
  };

  return (
    <div className="container">
      <h3 className="title">Refresh Tokens</h3>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li className="is-active">
            <Link aria-current="page" to={`/refreshtokens`}>
              Refresh Tokens
            </Link>
          </li>
        </ul>
      </nav>
      <div className="buttons">
        <button
          className="button is-danger"
          data-testid="deleteSelected"
          onClick={() => onDeleteSelectedTokens()}
        >
          Delete Selected
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <td>ID</td>
            <td>UserID</td>
            <td>Expiration Date</td>
            <td>
              <center>
                <input
                  type="checkbox"
                  data-testid="toggleSelectAll"
                  defaultChecked={false}
                  onChange={(e) => onSelectAll(e.target.checked)}
                ></input>
              </center>
            </td>
          </tr>
        </thead>
        <tbody>
          {tokens.length > 0 &&
            tokens.map((token, index) => (
              <tr key={token.id}>
                <td>{token.id}</td>
                <td>{token.userId}</td>
                <td>{token.expirationDate}</td>
                <td>
                  <center>
                    <input
                      type="checkbox"
                      data-testid={`checkBoxItem${token.id}`}
                      checked={token.selected}
                      onChange={(e) =>
                        onChangeItemSelected(e.target.checked, index)
                      }
                    ></input>
                  </center>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
