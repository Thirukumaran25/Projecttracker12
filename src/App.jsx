import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectDashboard from './components/ProjectDashboard';
import ProjectDetails from './components/ProjectDetails';
import Login from './components/Login';
import Register from './components/Register';
import './app.css'
import axiosInstance from './api/axios';

function App() {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserRole = async () => {
                try {
                    const response = await axiosInstance.get('/auth/user/');
                    setUserRole(response.data.role);
                } catch (error) {
                    console.error("Token invalid or expired. Logging out.", error);
                    localStorage.removeItem('token');
                    setUserRole(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserRole();
        } else {
            setLoading(false);
        }
    }, []);

    const handleLoginSuccess = (role) => {
        setUserRole(role);
    };

    const handleLogout = () => {
        setUserRole(null);
        localStorage.removeItem('token');
    };

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    return (
        <Router>
            <div className="app-container">
                <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
                    <h1 className="text-xl font-bold">Mini Project Tracker</h1>
                    <div className="space-x-4">
                        {userRole ? (
                            <>
                                <Link to="/" className="hover:underline">Home</Link>
                                <button onClick={handleLogout} className="hover:underline">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:underline">Login</Link>
                                <Link to="/register" className="hover:underline">Register</Link>
                            </>
                        )}
                    </div>
                </nav>

                <main className="p-6 bg-amber-300">
                    <Routes>
                        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/register" element={<Register />} />
                        {userRole ? (
                            <>
                                <Route path="/" element={<ProjectDashboard userRole={userRole} />} />
                                <Route path="/projects/:projectId" element={<ProjectDetails />} />
                            </>
                        ) : (
                            <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        )}
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;