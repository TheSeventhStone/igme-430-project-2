const helper = require("./helper.js");
const React = require("react");
const {useState, useEffect} = React;
const {createRoot} = require("react-dom/client");

const UserList = (props) => {
    const [users, setUsers] = useState(props.users);

    useEffect(() => {
        const loadUsersFromServer = async () => {
            const response = await fetch("/getUsers");
            const data = await response.json();
            setUsers(data.users);
        };
        loadUsersFromServer();
    }, [props.reloadUsers]);

    if(users.length === 0){
        return(
            <div className="userList">
                <h3 className="emptyUser">No Users Yet!</h3>
            </div>
        );
    }

    const userNodes = users.map(user => {
        return(
            <div key={user._id} className="user">
                <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">{user.username}</h3>
            </div>
        );
    });

    return(
        <div className="userList">
            {userNodes}
        </div>
    );
};

const App = () => {
    const [reloadUsers] = useState(false);

    return(
        <div>
            <div id="users">
                <UserList users={[]} reloadUsers={reloadUsers}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById("app"));
    root.render(<App/>);
};

window.onload = init;