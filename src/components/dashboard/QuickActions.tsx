import React from 'react';
import { Plus, FileEdit, List, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'New Meal Plan',
      icon: <Plus className="w-4 h-4" />,
      onClick: () => navigate('/meal-plans'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'Edit Preferences',
      icon: <FileEdit className="w-4 h-4" />,
      onClick: () => navigate('/preferences'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      label: 'Shopping List',
      icon: <List className="w-4 h-4" />,
      onClick: () => navigate('/shopping'),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => navigate('/settings'),
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(({ label, icon, onClick, color }) => (
        <button
          key={label}
          onClick={onClick}
          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white ${color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {icon}
          <span className="ml-2">{label}</span>
        </button>
      ))}
    </div>
  );
}