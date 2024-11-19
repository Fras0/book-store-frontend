import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login-.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useAuth } from "../../authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/login`,
        loginData
      );



      localStorage.setItem("token", response.data.token);
      login(response.data.token);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
    <Navbar />
    <section className="login-section">
      <div className="login-container">
        <h2>Login</h2>
        
        {/* Display error message if there's any */}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </section>
  </>
  );
};

export default Login;
