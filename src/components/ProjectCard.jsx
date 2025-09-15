import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, isAfter } from 'date-fns';

const statusColors = {
  assigned: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const ProjectCard = ({ project, onEdit, onDelete, onStatusUpdate }) => {
  const isOverdue = isAfter(new Date(), new Date(project.due_date)) && project.status !== 'completed';

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
          {project.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Assigned to:</span> {project.assigned_to_name}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <span className="font-medium">Due:</span> {formatDistanceToNow(new Date(project.due_date), { addSuffix: true })}
        {isOverdue && <span className="ml-2 text-red-500 font-bold">(Overdue)</span>}
      </p>
      <p className="text-gray-700 text-sm">{project.description.substring(0, 100)}...</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to={`/projects/${project.id}`} className="btn-secondary flex-1 text-center">
          View Details
        </Link>
        {onEdit && (
          <button onClick={() => onEdit(project)} className="btn-tertiary flex-1 text-center">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(project.id)} className="btn-danger flex-1 text-center">
            Delete
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={() => onStatusUpdate(project.id, 'in_progress')}
          className="w-full text-xs px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
        >
          Mark as In Progress
        </button>
        <button
          onClick={() => onStatusUpdate(project.id, 'completed')}
          className="w-full text-xs px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
        >
          Mark as Completed
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;