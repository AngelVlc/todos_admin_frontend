import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

export const RefreshTokensPage = () => {
  const [tokens, setTokens] = useState([]);
  let history = useHistory();

  useEffect(() => {
    const getRefreshTokens = async () => {
      const res = await axios.get('refreshtokens')
      setTokens(res.data);
    }
    getRefreshTokens()
  }, []);

  return (
    <div className="container">
      <h3 className="title">Refresh Tokens</h3>
      <table className="table">
        <thead>
          <tr>
            <td>ID</td>
            <td>UserID</td>
            <td>Expiration Date</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {tokens.length > 0 && tokens.map((token) => (
            <tr key={token.id}>
              <td>{token.id}</td>
              <td>{token.userId}</td>
              <td>{token.expirationDate}</td>
              <td>
                <center>
                  <Link className="has-text-black" data-testid={`deleteToken${token.id}`} to={`/refreshtokens/${token.id}/delete`}>
                    <span className="icon is-small">
                      <i className="fas fa-trash-alt fa-xs"></i>
                    </span>
                  </Link>
                </center>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
    </div>
  );
}
