import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { doGet, doDelete } from '../../helpers/api';

export const UserDeletePage = () => {
  const { auth, requestsDispatch } = useContext(AppContext)
  const [user, setUser] = useState(null);
  let { userId } = useParams();
  let history = useHistory();

  useEffect(() => {
    const getUser = async () => {
      const res = await doGet(`users/${userId}`, auth.info.token, requestsDispatch)
      let title = `Delete user ${res.name}`
      if (res.isAdmin) {
        title = `Delete admin user '${res.name}'?`
      }
      const info = {
        ...res,
        title: title
      }
      setUser(info);
    }
    if (auth.info) {
      getUser();
    }
  }, [userId, auth.info, requestsDispatch]);

  const deleteUser = async () => {
    await doDelete(`users/${userId}`, auth.info.token, requestsDispatch)
    history.goBack();
  }

  return (
    <>
      {user &&
        <div className="container">
          <h3 className="title">{user.title}</h3>
          <div className="buttons">
            <button className="button is-danger" data-testid="yes" onClick={() => deleteUser()}>YES</button>
            <button className="button" data-testid="no" onClick={() => history.goBack()}>NO</button>
          </div>
        </div>
      }
    </>
  );
}
