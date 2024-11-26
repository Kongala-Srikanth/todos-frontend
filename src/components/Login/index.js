import { useState } from 'react';
import Cookies from 'js-cookie';
import { useHistory, Redirect } from 'react-router-dom'; 
import './index.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory(); 

    if (Cookies.get('jwt') !== undefined){
        return <Redirect to='/' />
    }

    const onSubmitLogin = async (e) => {
        e.preventDefault();

        const userDetails = {
            email, password
        }

        const url = 'https://todos-app-nk7v.onrender.com/login'

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDetails),
        });

        const data = await response.json();

        if (response.ok){
            Cookies.set('jwt', data.jwtToken,{ expires: 30, path: '' })
            history.push('/');  
        }else{
            setError(data.errorMsg)
        }

        
    };

    return (
        <div className="form-main-container">
            <div className="form-container">
                <div className="form-card">
                    <h2>Welcome Back!</h2>
                    <form onSubmit={onSubmitLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                        {error && <p className="error">{error}</p>}
                        <p className="signup-link">Don’t have an account? <a href="/signup">Sign Up</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;