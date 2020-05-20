import React from 'react';
import { useHistory } from "react-router-dom";

export const ListPage = () => {
    let history = useHistory();

    return (
        <div className="container">
            <h3 className="title">LIST PAGE</h3>
            <button className="button" onClick={() => history.push('/')}>Home</button>
        </div>
    )
}
