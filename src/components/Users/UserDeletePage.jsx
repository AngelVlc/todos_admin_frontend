import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

export const UserDeletePage = () => {
  const [user, setUser] = useState(null);
  let { userId } = useParams();
  let history = useHistory();

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`users/${userId}`);
      let title = `Delete user ${res.data.name}`;
      if (res.data.isAdmin) {
        title = `Delete admin user '${res.data.name}'?`;
      }
      const info = {
        ...res.data,
        title: title
      };
      setUser(info);
    }
    getUser();
  }, [userId]);

  const deleteUser = async () => {
    await axios.delete(`users/${userId}`);
    history.push('/users');
  }

  return (
    <>
      {user &&
        <div className="container">
          <h3 className="title">{user.title}</h3>
          <nav className="breadcrumb" aria-label="breadcrumbs">
              <ul>
                  <li><Link to={`/`}>Home</Link></li>
                  <li><Link to={`/users`}>Users</Link></li>
                  <li><Link to={`/users`}>Users</Link></li>
                  <li><Link aria-current="page" to={`/users/${userId}/edit`}>{user.name}</Link></li>
                  <li className="is-active"><Link aria-current="page" to={`/users/${userId}/delete`}>{`Delete ${user.name}`}</Link></li>
              </ul>
          </nav>
          <div className="buttons">
            <button className="button is-danger" data-testid="yes" onClick={() => deleteUser()}>YES</button>
            <button className="button" data-testid="no" onClick={() => history.goBack()}>NO</button>
          </div>
        </div>
      }
    </>
  );
}
