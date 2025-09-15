import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axiosInstance.get(`/mini-projects/${projectId}/`);
                setProject(response.data);
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleUpdateStatus = async (newStatus) => {
        try {
            const response = await axiosInstance.patch(`/mini-projects/${projectId}/`, {
                status: newStatus
            });
            setProject(response.data);
            alert(`Project status updated to: ${newStatus}`);
        } catch (error) {
            console.error("Error updating project status:", error.response.data);
            alert("Failed to update project status. You may not have permission.");
        }
    };

    if (isLoading) return <div>Loading project details...</div>;
    if (!project) return <div>Project not found.</div>;

    return (
        <div className="project-details-container">
            <h2>{project.title}</h2>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Assigned To:</strong> {project.assigned_to_name}</p>
            <p><strong>Current Status:</strong> {project.status}</p>
            <p><strong>Priority:</strong> {project.priority}</p>
            <p><strong>Due Date:</strong> {project.due_date}</p>
            
            <div className="update-controls">
                <button onClick={() => handleUpdateStatus('in_progress')}>
                    Mark as In Progress
                </button>
                <button onClick={() => handleUpdateStatus('completed')}>
                    Mark as Complete
                </button>
            </div>
        </div>
    );
};

export default ProjectDetails;