import { useHistory } from "react-router-dom";

export const HomePage = () => {
    let history = useHistory();

    return (
        <div className="container">
            <h3 className="title">HOME</h3>
            <button className="button" onClick={() => history.push('/users')} data-testid="users">Users</button>
            <button className="button" onClick={() => history.push('/lists')} data-testid="lists">Lists</button>
        </div>
    )
}
