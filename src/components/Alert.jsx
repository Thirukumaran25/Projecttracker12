import React from 'react';

const Alert = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-md mb-4 flex justify-between items-center`}>
      <p>{message}</p>
      <button onClick={onClose} className="text-lg font-bold">
        &times;
      </button>
    </div>
  );
};

export default Alert;