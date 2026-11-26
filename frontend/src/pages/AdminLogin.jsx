import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const validate = (name, value) => {
    let err = "";
    if (name === "email") {
      if (!/\S+@\S+\.\S+/.test(value)) {
        err = "Invalid admin email format.";
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
    localStorage.removeItem("admin");
    setAdmin(null);
    navigate("/admin-login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasErrors = Object.values(errors).some(err => err !== "");
    if (hasErrors) {
        setError("Please fix the validation errors before submitting.");
        return;
    }

    try {
      const res = await api.post("/admin/login", form);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      navigate("/admin-dashboard"); 
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid admin credentials");
    }
  };

  if (admin) {
     return (
       <div className="section">
         <div className="container" style={{maxWidth: '400px'}}>
           <div className="card text-center">
             <h2 className="font-bold mb-4">Admin Access</h2>
             <p className="mb-8 text-gray-500">Already logged in as admin.</p>
             <div className="flex flex-col gap-4">
               <button onClick={() => navigate("/admin-dashboard")} className="btn btn-primary">
                 Go to Dashboard
               </button>
               <button onClick={handleLogout} className="btn btn-outline">
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
      <div className="container" style={{maxWidth: '400px'}}>
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="font-bold">Admin Login</h2>
            <p className="text-gray-500">Restricted Access</p>
          </div>

          {error && (
            <div style={{backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', border: '1px solid #fecaca'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Email</label>
              <input
                name="email"
                type="email"
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
                value={form.password}
                onChange={handleChange}
                required
                style={{borderColor: errors.password ? '#dc2626' : '#ccc'}}
              />
              {errors.password && <p style={{color: '#dc2626', fontSize: '12px', marginTop: '4px'}}>{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
              Login as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;