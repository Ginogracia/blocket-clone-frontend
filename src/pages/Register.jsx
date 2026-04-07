import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../hooks/useApi";
import "../styles/pages/Auth.scss";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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
      const response = await api.post("/auth/register", formData);
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
        <h1 className="auth__title">Skapa konto</h1>
        <p className="auth__subtitle">Välkommen till Blocket</p>

        {error && <div className="auth__error">{error}</div>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label">Användarnamn</label>
            <input
              className="auth__input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ditt användarnamn"
              required
            />
          </div>

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
              placeholder="Minst 6 tecken"
              required
            />
          </div>

          <button className="auth__submit" type="submit" disabled={loading}>
            {loading ? "Skapar konto..." : "Skapa konto"}
          </button>
        </form>

        <p className="auth__switch">
          Har du redan ett konto? <Link to="/login">Logga in här</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
