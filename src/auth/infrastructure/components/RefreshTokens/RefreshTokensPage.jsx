import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { TableWithSelectors } from "../../../../shared/infrastructure/components/TableWithSelectors/TableWithSelectors";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import {
  GetRefreshTokensUseCase,
  DeleteSelectedRefreshTokensUseCase,
} from "../../../application/refreshTokens";

export const RefreshTokensPage = () => {
  const [tokens, setTokens] = useState([]);
  const { useCaseFactory } = useContext(AppContext);
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortColumn: "id",
    sortOrder: "desc",
  });

  const getRefreshTokens = useCallback(async () => {
    const getRefreshTokensUseCase = useCaseFactory.get(GetRefreshTokensUseCase);
    const refreshTokens = await getRefreshTokensUseCase.execute(pageInfo);

    setTokens(refreshTokens);
  }, [useCaseFactory, pageInfo]);

  useEffect(() => {
    getRefreshTokens();
  }, [getRefreshTokens]);

  const onDeleteSelectedTokens = async () => {
    const deleteSelectedRefreshTokensUseCase = useCaseFactory.get(
      DeleteSelectedRefreshTokensUseCase
    );
    const ok = await deleteSelectedRefreshTokensUseCase.execute(tokens);
    if (ok) {
      getRefreshTokens();
    }
  };

  return (
    <div className="container">
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
      <h3 className="title">Refresh Tokens</h3>
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
        columns={[
          { name: "id", title: "ID" },
          { name: "userId", title: "User ID" },
          { name: "expirationDate", title: "Expiration Date" },
        ]}
        rows={tokens}
        idColumnName={"id"}
        selectedColumnName={"selected"}
        paginationInfo={pageInfo}
        changeSelected={setTokens}
        changePagination={setPageInfo}
      />
    </div>
  );
};
