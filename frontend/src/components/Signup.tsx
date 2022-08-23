import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const usernameRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, [usernameRef]);

    const handleSubmit = () => {
        if (password === confirmPassword) {
            axios.post("http://159.223.143.90/api/auth/signup", {
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
        } else {
            setErrorMessage("Passwords do not match.")
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                    aria-label="username"
                    ref={usernameRef}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password"
                    aria-label="password"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    aria-label="password"
                />
                <button type="button" onClick={handleSubmit}>Sign Up</button>
            </form>
            <Link to={"../login"}>Already have an account?</Link>
        </div>
    );
}

export default Signup;