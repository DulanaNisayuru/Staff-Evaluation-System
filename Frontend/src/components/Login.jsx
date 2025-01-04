import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/Login.css';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add the 'login-body' class when the component mounts
    document.body.classList.add("login-body");

    // Remove the 'login-body' class when the component unmounts
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        localStorage.setItem("token", data.token);
        localStorage.setItem("Role", data.user.role);
        if (data.user.role === "ADMIN") {
          navigate("/adminPage");
        } else if (data.user.role === "MANAGER") {
          navigate("/mgrPage");
        } else {
          navigate("/user-profile");
        }
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Check your Internet Connection...");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="log-in-avatar"></div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <PersonIcon style={{ color: "#333", marginBottom: "15px" }} />
            <input
              type="email"
              name="email"
              placeholder="Username"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <KeyIcon style={{ color: "#333", marginBottom: "15px" }} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="actions">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
