import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const MyServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const res = await api.get("/services/my");
        setServices(res.data);
      } catch (err) {
        setError("Failed to load your services.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchMyServices();
    }
  }, [user]);

  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure?")) return;
      try {
          await api.delete(`/services/${id}`);
          setServices(services.filter(service => service._id !== id));
      } catch (err) {
          alert("Failed to delete service.");
      }
  };

  if (loading) return <div className="section"><p className="text-center">Loading services...</p></div>;

  return (
    <div className="section">
      <div className="container">
        
        <div className="flex justify-between items-center mb-12">
            <h1 className="font-bold">My Services</h1>
            <Link to="/post-service" className="btn btn-primary">
                + Post New Service
            </Link>
        </div>

        {error && <p className="text-center" style={{color: 'red'}}>{error}</p>}

        {services.length === 0 ? (
            <div className="card text-center">
                <p className="text-gray-500 mb-4">You haven't posted any services yet.</p>
                <Link to="/post-service" className="font-bold">Get Started</Link>
            </div>
        ) : (
            <div className="grid grid-3">
                {services.map(service => (
                    <div key={service._id} className="card">
                        <div className="card-body">
                            <div className="flex justify-between mb-4">
                                <span className="font-bold text-gray-500 uppercase" style={{fontSize: '12px'}}>{service.category}</span>
                                <span className="font-bold text-gray-500" style={{fontSize: '10px'}}>{service.type.toUpperCase()}</span>
                            </div>
                            <h3 className="font-bold mb-4">{service.title}</h3>
                            <p className="text-gray-500 mb-8">{service.description}</p>
                            
                            <div className="card-footer">
                                <span className="font-bold">Rs. {service.fee}</span>
                                <div className="flex gap-4">
                                    <Link to={`/edit-service/${service._id}`} className="btn btn-outline">Edit</Link>
                                    <button 
                                        onClick={() => handleDelete(service._id)}
                                        className="btn"
                                        style={{ color: 'red', borderColor: 'red' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;