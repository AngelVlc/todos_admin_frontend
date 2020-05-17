import React from 'react';
import { useHistory } from "react-router-dom";

export const HomePage = () => {
    let history = useHistory();

    return (
        <div className="container">
            <h3 className="title">HOME</h3>
            <button className="button" onClick={() => history.push('/users')}>Users</button>
        </div>
    )
}
