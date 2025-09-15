import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            const response = await axiosInstance.post('auth/login/', {
                username: username,
                password: password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            const userResponse = await axiosInstance.get('auth/user/');
            const userRole = userResponse.data.role;
            onLoginSuccess(userRole);
            navigate('/');
        } catch (err) {
            console.error("Login failed:", err.response);
            setError('Invalid username or password.');
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}
            <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                Login
            </button>
        </form>
    );
};

export default Login;