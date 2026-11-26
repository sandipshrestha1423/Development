import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api"; 
import LocationPicker from "../components/LocationPicker"; 
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState(null); 
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); 
  const { user, logout } = useAuth();

  const validate = (name, value) => {
    let err = "";
    if (name === "name") {
      if (value.trim().length < 3) {
        err = "Name must be at least 3 characters.";
      } else if (/[0-9]/.test(value)) {
        err = "Name should not contain numbers.";
      }
    } else if (name === "email") {
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
  
  const handleLocationSelect = (loc) => {
      setLocation(loc); 
  };
  
  const handleLogout = () => {
    logout();
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasErrors = Object.values(errors).some(err => err !== "");
    if (hasErrors) {
        setError("Please fix the validation errors before submitting.");
        return;
    }

    if (!location) {
        setError("Please select your location on the map.");
        return;
    }

    try {
      const payload = { ...form, location };
      const res = await api.post("/auth/register", payload);
      setMessage(res.data.msg);
      setError("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
      setMessage("");
    }
  };

  if (user) {
    return (
      <div className="section">
        <div className="container" style={{maxWidth: '400px'}}>
          <div className="card text-center">
            <h2 className="font-bold mb-4">Account Active</h2>
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
      <div className="container" style={{maxWidth: '800px'}}>
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="font-bold">Create an Account</h2>
            <p className="text-gray-500">Sign up to get started.</p>
          </div>

          {error && (
            <div style={{backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', border: '1px solid #fecaca'}}>
              {error}
            </div>
          )}

          {message && (
            <div style={{backgroundColor: '#dcfce7', color: '#16a34a', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', border: '1px solid #bbf7d0'}}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Ram Shrestha"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{borderColor: errors.name ? '#dc2626' : '#ccc'}}
                />
                {errors.name && <p style={{color: '#dc2626', fontSize: '12px', marginTop: '4px'}}>{errors.name}</p>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="ram@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{borderColor: errors.email ? '#dc2626' : '#ccc'}}
                />
                {errors.email && <p style={{color: '#dc2626', fontSize: '12px', marginTop: '4px'}}>{errors.email}</p>}
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Choose a password"
                value={form.password}
                onChange={handleChange}
                required
                style={{borderColor: errors.password ? '#dc2626' : '#ccc'}}
              />
              {errors.password && <p style={{color: '#dc2626', fontSize: '12px', marginTop: '4px'}}>{errors.password}</p>}
            </div>

            <div className="form-group">
                <label>
                    Your Location <small>(Click on map to select)</small>
                </label>
                <div style={{height: '250px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden'}}>
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                </div>
                {location && (
                    <p className="mt-4" style={{color: 'green', fontSize: '14px'}}><strong>Location selected:</strong> {location.address}</p>
                )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{width: '100%', marginTop: '20px', padding: '12px'}}
            >
              Register Now
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;