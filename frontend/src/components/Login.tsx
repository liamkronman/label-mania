import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const usernameRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, [usernameRef]);

    const handleSubmit = () => {
        axios.post("http://159.223.143.90/api/auth/signin", {
            username,
            password
        })
        .then(resp => {
            if (resp.data.accessToken) {
                localStorage.setItem("accessToken", resp.data.accessToken);
                navigate("../");
            } else {
                setErrorMessage(resp.data.message);
            }
        })
        .catch(err => {
            setErrorMessage(err.response.data.message);
        })
    }

    return (
        <div>
            <h1>Log In</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username..."
                    aria-label="username"
                    ref={usernameRef}
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
            <Link to={"../signup"}>Don't have an account?</Link>
        </div>
    );
}

export default Login;