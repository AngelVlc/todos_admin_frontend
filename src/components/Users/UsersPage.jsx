import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  let history = useHistory();

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get('users')
      setUsers(res.data);
    }
    getUsers()
  }, []);

  return (
    <div className="container">
      <h3 className="title">USERS</h3>
      <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
              <li><a href="/">Home</a></li>
              <li className="is-active"><Link aria-current="page" to={`/users`}>Users</Link></li>
          </ul>
      </nav>
      <table className="table">
        <thead>
          <tr>
            <td>User</td>
            <td>Admin?</td>
            <td>
              <button className="button is-small" data-testid="addNew" onClick={() => history.push('users/new')}>
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
                <Link className="has-text-black" data-testid={`editUser${user.id}`} to={`/users/${user.id}/edit`}>{user.name}</Link>
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
                  <Link className="has-text-black" data-testid={`deleteUser${user.id}`} to={`/users/${user.id}/delete`}>
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
