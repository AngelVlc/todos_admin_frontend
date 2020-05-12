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
      setUser(res);
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
        <>
          <h4>{`Delete user '${user.name}' (is admin: ${user.isAdmin})?`}</h4>
          <button onClick={() => deleteUser()}>YES</button>
          <button onClick={() => history.goBack()}>NO</button>
        </>
      }
    </>
  );
}
