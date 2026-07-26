import { NavLink } from 'react-router';
import './Admin.css';

function Admin() {
  const adminOptions = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View platform analytics and insights',
      icon: '📊',
      route: '/admin/dashboard'
    },
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: '➕',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: '✏️',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: '🗑️',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Upload & Delete',
      description: 'Upload and delete solution videos for problems',
      icon: '🎬',
      route: '/admin/video'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-container">
        <NavLink to="/" className="admin-back-btn">← Back to Home</NavLink>

        <div className="admin-dashboard-header">
          <h1>Admin Panel</h1>
          <p>Manage coding problems on your platform</p>
        </div>

        <div className="admin-options-grid">
          {adminOptions.map((option) => (
            <NavLink
              key={option.id}
              to={option.route}
              className="admin-option-card"
            >
              <div className={`admin-option-icon ${option.id}`}>
                {option.icon}
              </div>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <span className={`admin-option-btn ${option.id}`}>
                {option.title}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;