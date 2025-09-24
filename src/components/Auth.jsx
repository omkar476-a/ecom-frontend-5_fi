import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // show success/error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // reset message

    const url = isLogin
      ? "http://localhost:8080/auth/login"
      : "http://localhost:8080/auth/register";

    try {
      const res = await axios.post(url, { username, password });

      // After login
      if (isLogin) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          setIsAuthenticated(true);
          navigate("/"); // go to home
        } else {
          setMessage("Login failed");
        }
      } 
      // After registration
      else {
        if (res.status === 200 || res.status === 201) {
          setMessage("Registration successful! You can now login.");
          setIsLogin(true); // switch to login form
          setUsername("");
          setPassword("");
        } else {
          setMessage("Registration failed");
        }
      }
    } catch (err) {
      // Show error from backend or fallback
      setMessage(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center">
            {isLogin ? "Login" : "Register"}
          </h3>

          <div className="text-center mb-3">
            <button
              className={`btn btn-sm ${isLogin ? "btn-primary" : "btn-outline-primary"} me-2`}
              onClick={() => { setIsLogin(true); setMessage(""); }}
            >
              Login
            </button>
            <button
              className={`btn btn-sm ${!isLogin ? "btn-success" : "btn-outline-success"}`}
              onClick={() => { setIsLogin(false); setMessage(""); }}
            >
              Register
            </button>
          </div>

          {message && <p className={`text-center ${isLogin ? "text-danger" : "text-success"}`}>{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn w-100 ${isLogin ? "btn-primary" : "btn-success"}`}
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
