import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/components/Navbar.scss";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">blocket</span>
        </Link>

        <div className="navbar__search">
          <input
            type="text"
            placeholder="Sök på Blocket"
            className="navbar__search-input"
          />
          <button className="navbar__search-button">Sök</button>
        </div>

        <div className="navbar__actions">
          {user ? (
            <>
              <span className="navbar__username">Hej, {user.username}</span>
              <Link to="/create-listing" className="navbar__sell-button">
                + Lägg upp annons
              </Link>
              <button onClick={handleLogout} className="navbar__logout-button">
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__login-button">
                Logga in
              </Link>
              <Link to="/register" className="navbar__register-button">
                Registrera
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
