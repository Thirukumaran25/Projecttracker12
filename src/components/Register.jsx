import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'trainee'
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axiosInstance.post('/auth/register/', formData);
            
            if (response.status === 201) {
                setMessage('Registration successful! You can now log in.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
    
            if (error.response && error.response.status === 400 && error.response.data) {
                const errorData = error.response.data;
                let errorMessage = 'Registration failed: ';
                if (errorData.username) {
                    errorMessage += `Username: ${errorData.username.join(', ')}`;
                } else if (errorData.password) {
                    errorMessage += `Password: ${errorData.password.join(', ')}`;
                }
                setMessage(errorMessage);
            } else {
                setMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Register a New Account</h2>
            {message && (
                <div className={`mb-4 p-2 rounded ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            
            <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email (optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                    <option value="trainee">Trainee</option>
                    <option value="trainer">Trainer</option>
                </select>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white py-2 rounded-md">
                {isLoading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default Register;