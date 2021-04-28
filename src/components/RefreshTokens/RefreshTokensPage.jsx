import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const RefreshTokensPage = () => {
  const [tokens, setTokens] = useState([]);

  const getRefreshTokens = async () => {
    const res = await axios.get('refreshtokens')
    const data = res.data.map(token => {
      return {
        ...token,
        selected: false
      }
    });
    setTokens(data);
  }

  useEffect(() => {
    getRefreshTokens()
  }, []);

  const onSelectAll = (newValue) => {
    const data = [...tokens].map((token) => {
      return {
        ...token,
        selected: newValue
      }
    });
    setTokens(data);
  };

  const onChangeItemSelected = (newValue, index) => {
    const data = [...tokens];
    data[index].selected = newValue;
    setTokens(data);
  };

  const onDeleteSelectedTokens = async () => {
    const selectedIDs = tokens.reduce((filtered, token) => {
      if (token.selected) {
         filtered.push(token.id);
      }
      return filtered;
    }, []);

    const res = await axios.delete('refreshtokens', {data: selectedIDs});
    if (res.status === 204) {
      getRefreshTokens();
    }
  };

  return (
    <div className="container">
      <h3 className="title">Refresh Tokens</h3>
      <div className="buttons">
        <button className="button is-danger" data-testid="deleteSelected" onClick={() => onDeleteSelectedTokens()}>Delete Selected</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <td>ID</td>
            <td>UserID</td>
            <td>Expiration Date</td>
            <td>
              <center>
                  <input type="checkbox" data-testid="toggleSelectAll" defaultChecked={false} onChange={(e) => onSelectAll(e.target.checked)}></input>
                </center>
            </td>
          </tr>
        </thead>
        <tbody>
          {tokens.length > 0 && tokens.map((token, index) => (
            <tr key={token.id}>
              <td>{token.id}</td>
              <td>{token.userId}</td>
              <td>{token.expirationDate}</td>
              <td>
                <center>
                  <input type="checkbox" data-testid={`checkBoxItem${token.id}`} checked={token.selected} onChange={(e) => onChangeItemSelected(e.target.checked, index)}></input>
                </center>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
