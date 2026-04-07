import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../hooks/useApi";
import "../styles/pages/Auth.scss";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", formData);
      login(response.data.user, response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Logga in</h1>
        <p className="auth__subtitle">Välkommen tillbaka</p>

        {error && <div className="auth__error">{error}</div>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label">E-post</label>
            <input
              className="auth__input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="din@email.com"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label">Lösenord</label>
            <input
              className="auth__input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ditt lösenord"
              required
            />
          </div>

          <button className="auth__submit" type="submit" disabled={loading}>
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <p className="auth__switch">
          Inget konto? <Link to="/register">Registrera dig här</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
