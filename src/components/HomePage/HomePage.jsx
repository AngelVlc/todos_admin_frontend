import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { doGet } from '../../helpers/api';

export const HomePage = () => {
  const { auth, requestsDispatch } = useContext(AppContext)
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (auth.info) {
      doGet('users', auth.info.token, requestsDispatch)
        .then(res => {
          setUsers(res);
        })
    }
  }, [auth.info, requestsDispatch]);

  return (
    <div>
      <h4>HOME PAGE</h4>
      <ul>
        {users.length > 0 && users.map((user) => (
          <li key={user.id}>
            <span>{user.name}</span>
            <Link to={{pathname: `/user/${user.id}/delete`, state: {userName: user.name, isAdmin: user.isAdmin, returnUrl: "/"}}}>Delete</Link>
          </li>
        ))
        }
      </ul>
    </div>
  );
}
