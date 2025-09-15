import React from 'react';

const ProjectFilters = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border">
      <h3 className="text-xl font-semibold mb-4">Filter Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">By Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">By Priority</label>
          <select
            name="priority"
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="btn-tertiary w-full"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;