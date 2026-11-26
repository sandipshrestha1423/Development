import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function PostService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    type: "request",
    fee: "",
    feeUnit: "Hour",
    preferredTime: "",
    preferredDay: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        try {
          const res = await api.get(`/services/${id}`);
          setFormData(res.data);
        } catch (err) {
          setMessage("Failed to load service details.");
        }
      };
      fetchService();
    } else if (user && user.mobile) {
      setFormData(prev => ({ ...prev, mobile: user.mobile }));
    }
  }, [id, user]);

  const validate = (name, value) => {
    let error = "";
    if (name === "fee") {
      if (value !== "" && Number(value) < 0) {
        error = "Fee amount cannot be negative.";
      }
    } else if (name === "mobile") {
      if (value !== "" && !/^\d{10}$/.test(value)) {
        error = "Please enter a valid 10-digit mobile number.";
      }
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasErrors = Object.values(errors).some(error => error !== "");
    if (hasErrors) {
      setMessage("Please fix the errors before submitting.");
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      if (id) {
        await api.put(`/services/${id}`, formData);
        setMessage("Service updated successfully.");
      } else {
        await api.post("/services", formData);
        setMessage("Service posted. It will be visible once verified.");
      }
      
      if (user && formData.mobile && user.mobile !== formData.mobile) {
          updateUser({ mobile: formData.mobile });
      }

      setTimeout(() => navigate("/my-services"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to save service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card">
          <div style={{borderBottom: '1px solid #eee', marginBottom: '20px', paddingBottom: '10px'}}>
            <h2 className="font-bold">{id ? 'Edit Service' : 'Post a New Service'}</h2>
          </div>
          
          {message && (
            <div style={{
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '15px', 
              backgroundColor: message.toLowerCase().includes('success') || message.toLowerCase().includes('posted') ? '#dcfce7' : '#fee2e2',
              color: message.toLowerCase().includes('success') || message.toLowerCase().includes('posted') ? '#16a34a' : '#dc2626',
              border: '1px solid currentColor'
            }}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>I am looking to...</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="request">Find Help</option>
                <option value="offer">Offer Skill</option>
              </select>
            </div>

            <div className="form-group">
              <label>Service Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Need help with plumbing" />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="Repairs">Repairs</option>
                <option value="Tutoring">Tutoring</option>
                <option value="Delivery">Delivery</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Tech Support">Tech Support</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div className="form-group">
                <label>Fee Amount (Rs.)</label>
                <input 
                  type="number" 
                  name="fee" 
                  value={formData.fee} 
                  onChange={handleChange} 
                  required 
                  style={{borderColor: errors.fee ? '#dc2626' : '#ccc'}}
                />
                {errors.fee && (
                  <p style={{color: '#dc2626', fontSize: '12px', marginTop: '4px'}}>{errors.fee}</p>
                )}
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="feeUnit" value={formData.feeUnit} onChange={handleChange}>
                  <option value="Hour">Hour</option>
                  <option value="Day">Day</option>
                  <option value="Job">Job</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input 
                type="tel" 
                name="mobile" 
                value={formData.mobile} 
                onChange={handleChange} 
                required 
                style={{borderColor: errors.mobile ? '#dc2626' : '#ccc'}}
              />
              {errors.mobile && (
                <p style={{color: '#dc2626', fontSize: '12px', marginTop: '4px'}}>{errors.mobile}</p>
              )}
            </div>

            <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div className="form-group">
                <label>Preferred Time</label>
                <input type="text" name="preferredTime" value={formData.preferredTime} onChange={handleChange} placeholder="e.g. 9 AM - 5 PM" />
              </div>
              <div className="form-group">
                <label>Preferred Days</label>
                <input type="text" name="preferredDay" value={formData.preferredDay} onChange={handleChange} placeholder="e.g. Mon, Wed, Fri" />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" placeholder="Describe what you need or what you offer..."></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{width: '100%', marginTop: '10px', padding: '12px'}}>
              {loading ? 'Saving...' : (id ? 'Update Service' : 'Publish Service')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostService;