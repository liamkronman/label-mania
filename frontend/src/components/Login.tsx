import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        axios.post("http://159.223.143.90/api/auth/signin", {
            username,
            password
        })
        .then(user => {
            // if (user.accessToken) {
            //     localStorage.setItem("", user.accessToken)
            // }
        })
    }

    return (
        <div>
            <form>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username..."
                    aria-label="username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password..."
                    aria-label="password"
                />
                <button type="button" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    );
}

export default Login;