import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import api from "../api/api"; 

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  const { login, user, logout } = useAuth(); 

  const validate = (name, value) => {
    let err = "";
    if (name === "email") {
      if (!/\S+@\S+\.\S+/.test(value)) {
        err = "Invalid email format.";
      }
    } else if (name === "password") {
      if (value.length < 6) {
        err = "Password must be at least 6 characters.";
      }
    }
    setErrors({ ...errors, [name]: err });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const hasErrors = Object.values(errors).some(err => err !== "");
    if (hasErrors) {
        setError("Please fix the validation errors before submitting.");
        return;
    }

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user);
      navigate("/"); 
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password.");
    }
  };

  if (user) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth: '400px'}}>
          <div className="card text-center">
            <h2 className="font-bold mb-4">Already Logged In</h2>
            <p className="mb-8">
              You are currently logged in as <strong>{user.name}</strong>.
            </p>
            <div className="flex flex-col gap-4">
              <button onClick={() => navigate("/")} className="btn btn-outline">
                Go to Home
              </button>
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{maxWidth: '500px'}}>
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="font-bold">Login to Kaarya</h2>
            <p className="text-gray-500">Enter your details to continue.</p>
          </div>

          {error && (
            <div style={{backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', border: '1px solid #fecaca'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                style={{borderColor: errors.email ? '#dc2626' : '#ccc'}}
              />
              {errors.email && <p style={{color: '#dc2626', fontSize: '12px', marginTop: '4px'}}>{errors.email}</p>}
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                style={{borderColor: errors.password ? '#dc2626' : '#ccc'}}
              />
              {errors.password && <p style={{color: '#dc2626', fontSize: '12px', marginTop: '4px'}}>{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;