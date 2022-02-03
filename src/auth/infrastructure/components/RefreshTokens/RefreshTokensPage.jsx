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

  const onDeleteSelectedTokens = async () => {
    const deleteSelectedRefreshTokensUseCase = useCaseFactory.get(
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
      <TableWithSelectors
        columnTitles={["ID", "UserID", "Expiration Date"]}
        columnNames={["id", "userId", "expirationDate"]}
        rows={tokens}
        idColumnName={"id"}
        selectedColumnName={"selected"}
        onSelectedChanged={setTokens}
      />
    </div>
  );
};
