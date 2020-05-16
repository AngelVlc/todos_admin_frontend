import React, { useEffect, useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { doGet } from '../../helpers/api';

export const HomePage = () => {
  const { auth, requestsDispatch } = useContext(AppContext)
  const [users, setUsers] = useState([]);
  let history = useHistory();

  useEffect(() => {
    const getUsers = async() => {
      const res = await doGet('users', auth.info.token, requestsDispatch)
      setUsers(res);
    }
    if (auth.info) {
      getUsers();
    }
  }, [auth.info, requestsDispatch]);

  return (
    <div>
      <h4>HOME PAGE</h4>
      <ul>
        {users.length > 0 && users.map((user) => (
          <li key={user.id}>
            <span>{user.name}</span>
            {user.isAdmin &&
              <span>[Admin]</span>
            }
            <Link data-testid={`editUser${user.id}`} to={`/user/${user.id}/edit`}>Edit</Link>
            <Link data-testid={`deleteUser${user.id}`} to={`/user/${user.id}/delete`}>Delete</Link>
          </li>
        ))
        }
      </ul>
      <button data-testid="addNew" onClick={() => history.push('user/new')}>ADD USER</button>
    </div>
  );
}
