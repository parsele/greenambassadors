import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🌳 Amboseli Tree Tracker
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Map
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              <span className="navbar-user">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-button">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

