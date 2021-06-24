import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserForm } from './UserForm';
import axios from 'axios';

export const EditUserPage = () => {
    let { userId } = useParams();

    const [pageState, setPageState] = useState({name: ''});

    useEffect(() => {
        const getExistingUser = async () => {
            const res = await axios.get(`users/${userId}`)
            const user = res.data

            setPageState({
                name: user.name,
                isAdmin: user.isAdmin ? 'yes' : 'no'
            });
        }
        getExistingUser();
    }, [userId]);

    return (
        <div className="container">
            <h3 className="title">{`Edit user '${pageState.name}'`}</h3>
            <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li><Link to={`/`}>Home</Link></li>
                    <li><Link to={`/users`}>Users</Link></li>
                    <li className="is-active"><Link aria-current="page" to={`/users/${userId}`}>{pageState.name}</Link></li>
                </ul>
            </nav>
            <UserForm userId={userId} name={pageState.name} isAdmin={pageState.isAdmin} isNew={false} submintBtnText='SAVE' submitUrl={`users/${userId}`}></UserForm>
        </div>
    )
}