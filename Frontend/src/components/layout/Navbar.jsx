import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../authSlice';
import {
  Code2, BarChart3, Brain, Route, Sparkles,
  ChevronDown, LogOut, LayoutDashboard, Shield,
  Menu, X, Swords
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Problems', icon: Code2 },
  { to: '/visualizer', label: 'Visualizer', icon: BarChart3 },
  { to: '/ai-interview', label: 'AI Interview', icon: Brain },
  { to: '/career', label: 'Career', icon: Route },
  { to: '/review', label: 'Review', icon: Sparkles },
];

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <Swords size={20} />
          <span>CodeArena</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="navbar-actions">
          {/* User Dropdown */}
          <div className="navbar-dropdown" ref={dropdownRef}>
            <button
              className="navbar-user-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="navbar-avatar">
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="navbar-username">{user?.firstName}</span>
              <ChevronDown size={14} className={`navbar-chevron ${dropdownOpen ? 'open' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="navbar-dropdown-menu">
                <div className="navbar-dropdown-header">
                  <p className="navbar-dropdown-name">{user?.firstName} {user?.lastName}</p>
                  <p className="navbar-dropdown-email">{user?.email}</p>
                </div>
                <div className="navbar-dropdown-divider" />
                <Link
                  to="/dashboard"
                  className="navbar-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="navbar-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Shield size={16} />
                    Admin Panel
                  </Link>
                )}
                <div className="navbar-dropdown-divider" />
                <button className="navbar-dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar-mobile-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
