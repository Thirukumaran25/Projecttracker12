import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import Alert from './Alert';
import LoadingSpinner from './LoadingSpinner';
import ProjectFilters from './ProjectFilters';
import { isAfter } from 'date-fns';



const ProjectDashboard = ({ userRole }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', assignedTo: '' });
  const isTrainer = userRole === 'trainer';

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
  });

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...filters };
      const response = await axiosInstance.get('/mini-projects/', { params });
      const allProjects = response.data;
      setProjects(allProjects);

      const completed = allProjects.filter(p => p.status === 'completed').length;
      const inProgress = allProjects.filter(p => p.status === 'in_progress').length;
      const assigned = allProjects.filter(p => p.status === 'assigned').length;
      const now = new Date();
      const overdue = allProjects.filter(p => p.status !== 'completed' && isAfter(now, new Date(p.due_date))).length;
      
      setStats({
        total: allProjects.length,
        completed: completed,
        inProgress: inProgress,
        pending: assigned,
        overdue: overdue,
      });

    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const handleCreateProject = async (newProjectData) => {
    try {
      await axiosInstance.post('/mini-projects/', newProjectData);
      setSuccess("Project created successfully!");
      setShowForm(false);
      await fetchProjects();
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Failed to create project. Please check the details and try again.");
    }
  };

  const handleEditProject = async (updatedProjectData) => {
    try {
      await axiosInstance.put(`/mini-projects/${editingProject.id}/`, updatedProjectData);
      setSuccess("Project updated successfully!");
      setEditingProject(null);
      await fetchProjects();
    } catch (err) {
      console.error("Failed to update project:", err);
      setError("Failed to update project. Please check the details and try again.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axiosInstance.delete(`/mini-projects/${projectId}/`);
        setSuccess("Project deleted successfully!");
        await fetchProjects();
      } catch (err) {
        console.error("Failed to delete project:", err);
        setError("Failed to delete project. You may not have permission.");
      }
    }
  };
  
  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      await axiosInstance.patch(`/mini-projects/${projectId}/`, { status: newStatus });
      setSuccess("Project status updated successfully!");
      await fetchProjects();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status. You may not have permission.");
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setShowForm(false);
  };

  const handleCancelCreate = () => {
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleClearFilters = () => {
    setFilters({ status: '', priority: '', assignedTo: '' });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isTrainer ? 'Manage Projects' : 'My Projects'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isTrainer 
                ? 'Create, assign, and track mini projects for trainees.'
                : 'View and update your assigned mini projects.'
              }
            </p>
          </div>
          
          {isTrainer && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create New Project
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      {showForm && (
        <div className="mb-8">
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={handleCancelCreate}
            isEditing={false}
          />
        </div>
      )}
      {editingProject && (
        <div className="mb-8">
          <ProjectForm
            project={editingProject}
            onSubmit={handleEditProject}
            onCancel={handleCancelEdit}
            isEditing={true}
          />
        </div>
      )}

      <ProjectFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <LoadingSpinner text="Loading projects..." />
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            {Object.values(filters).some(filter => filter)
              ? 'Try adjusting your filters to see more projects.'
              : isTrainer
                ? 'Create your first project to get started.'
                : 'No projects have been assigned to you yet.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={isTrainer ? handleEditClick : null}
              onDelete={isTrainer ? handleDeleteProject : null}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;