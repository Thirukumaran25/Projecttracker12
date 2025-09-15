import React, { useState } from 'react';
import axiosInstance from '../api/axios';

const ProjectCreationForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'low',
        due_date: '',
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axiosInstance.post('/mini-projects/', formData);
            setMessage(`Project "${response.data.title}" created successfully!`);
            setFormData({ title: '', description: '', assigned_to: '', priority: 'low', due_date: '' });
        } catch (error) {
            console.error('Error creating project:', error.response ? error.response.data : error.message);
            setMessage('Failed to create project. Check the form and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Assign a New Mini Project</h2>
            {message && <div className="message">{message}</div>}
            
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
            
            <label>Assigned Trainee ID:</label>
            <input type="number" name="assigned_to" value={formData.assigned_to} onChange={handleChange} required />
            
            <label>Priority:</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            
            <label>Due Date:</label>
            <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} required />
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Assigning...' : 'Assign Project'}
            </button>
        </form>
    );
};

export default ProjectCreationForm;