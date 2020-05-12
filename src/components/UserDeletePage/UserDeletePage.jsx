import React, { useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { doDelete } from '../../helpers/api';

export const UserDeletePage = (props) => {
  const { auth, requestsDispatch } = useContext(AppContext)
  let { userId } = useParams();
  let history = useHistory();

  const state = props.location.state;

  const deleteUser = async () => {
    await doDelete(`users/${userId}`, auth.info.token, requestsDispatch)
    history.push(state.returnUrl);
  }

  return (
    <>
      <h4>{`Delete user '${state.userName}' (is admin: ${state.isAdmin})?`}</h4>
      <button onClick={() => deleteUser()}>YES</button>
      <button onClick={() => history.push(state.returnUrl)}>NO</button>
    </>
  );
}
