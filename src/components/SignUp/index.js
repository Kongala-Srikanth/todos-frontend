import { useState } from 'react';
import { useHistory } from 'react-router-dom'; 
import './index.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();  

    const onSubmitSignUp = async (event) => {
        event.preventDefault();

        const userDetails = {
            username, email, password
        };

        const url = 'https://todos-app-nk7v.onrender.com/register';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails),
            });

            if (response.ok) {
               
                setUsername('');
                setEmail('');
                setPassword('');
                setError(''); 
                history.push('/login');  
            } else {
                const data = await response.json();
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please try again later.');
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={onSubmitSignUp} className="signup-form">
                <h2>Signup</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Signup</button>
                {error && <p className="error">{error}</p>} {/* Display error if any */}
                <p className="switch-page">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
