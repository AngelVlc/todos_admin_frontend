import React, { useEffect, useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { doGet } from '../../helpers/api';

export const HomePage = () => {
  const { auth, requestsDispatch } = useContext(AppContext)
  const [users, setUsers] = useState([]);
  let history = useHistory();

  useEffect(() => {
    const getUsers = async () => {
      const res = await doGet('users', auth.info.token, requestsDispatch)
      setUsers(res);
    }
    if (auth.info) {
      getUsers();
    }
  }, [auth.info, requestsDispatch]);

  return (
    <div className="container">
      <h3 className="title">USERS</h3>
      <table className="table">
        <thead>
          <tr>
            <td>User</td>
            <td>Admin?</td>
            <td>
              <button className="button is-small" data-testid="addNew" onClick={() => history.push('user/new')}>
                <span className="icon is-small">
                  <i className="fas fa-plus"></i>
                </span>
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 && users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link className="has-text-black" data-testid={`editUser${user.id}`} to={`/user/${user.id}/edit`}>{user.name}</Link>
              </td>
              <td>
                {user.isAdmin &&
                  <center>
                    <span className="icon is-small">
                      <i className="fas fa-check fa-xs"></i>
                    </span>
                  </center>
                }
              </td>
              <td>
                <center>
                  <Link className="has-text-black" data-testid={`deleteUser${user.id}`} to={`/user/${user.id}/delete`}>
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
