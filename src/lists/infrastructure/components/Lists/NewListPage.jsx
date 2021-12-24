import React from 'react';
import { Link } from 'react-router-dom';
import { ListForm } from './ListForm';

export const NewListPage = () => {
    return (
        <div className="container">
            <h3 className="title">`New list'</h3>
            <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li><Link to={`/`}>Home</Link></li>
                    <li><Link to={`/lists`}>Lists</Link></li>
                    <li className="is-active"><Link aria-current="page" to={'/lists/new'}>New</Link></li>
                </ul>
            </nav>
            <ListForm name={''} items={[]} isNew={true} submintBtnText='CRATE' submitUrl={'lists'}/>
        </div>
    )
}
