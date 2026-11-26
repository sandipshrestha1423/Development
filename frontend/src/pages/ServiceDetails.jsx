import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function ServiceDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { user: authUser } = useAuth(); 

  const [service, setService] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 
  const [requestStatus, setRequestStatus] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
        const admin = localStorage.getItem("admin");
        setIsAdmin(!!admin);
    };
    checkAdmin();

    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        setService(res.data);
        
        if (authUser && !isAdmin) {
            try {
                const requestsRes = await api.get('/gig-requests/requester');
                const myRequest = requestsRes.data.find(req => req.service._id === id || req.service === id);
                if (myRequest) {
                    setRequestStatus(myRequest.status);
                }
            } catch (reqErr) {
                console.error("Error fetching requests", reqErr);
            }
        }

      } catch (err) {
        setError("Could not load service details.");
      } finally {
        setLoading(false); 
      }
    };
    fetchService();
  }, [id, authUser, isAdmin]);

  const handleRequestGig = async () => {
      if (!authUser) {
          navigate('/login');
          return;
      }
      setProcessing(true);
      try {
          await api.post('/gig-requests', { serviceId: id, message: "I'm interested in this service." });
          setRequestStatus('pending');
          alert("Request sent successfully!");
      } catch (err) {
          alert(err.response?.data?.msg || "Failed to send request.");
      } finally {
          setProcessing(false);
      }
  };

  const handleContact = () => {
      if (!authUser) { 
          navigate('/login');
      } else {
          navigate('/messages');
      }
  };

  if (loading) return <div className="section"><p className="text-center">Loading details...</p></div>;
  if (error) return <div className="section"><p className="text-center" style={{color: 'red'}}>{error}</p></div>;
  if (!service) return <div className="section"><p className="text-center">Service not found</p></div>;

  const { title, description, category, fee, feeUnit, preferredTime, preferredDay, location, user, type } = service;
  
  const isOwner = authUser && user && authUser._id === user._id;
  const showPhone = isAdmin || (requestStatus === 'accepted') || isOwner;

  return (
    <div className="section">
      <div className="container" style={{maxWidth: '900px'}}>
        <div className="card">
          <div className="card-header" style={{borderBottom: '1px solid #eee', marginBottom: '20px', paddingBottom: '10px'}}>
            <h1 className="font-bold">{title}</h1>
            <p className="text-gray-500">
              <span className="font-bold" style={{textTransform: 'uppercase', marginRight: '10px'}}>{category}</span>
              Posted by {user?.name}
            </p>
          </div>

          <div className="grid" style={{gridTemplateColumns: '2fr 1fr', gap: '30px'}}>
            <div>
              <h3 className="font-bold mb-4">Description</h3>
              <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#555'}}>{description}</p>
              
              <h3 className="font-bold mb-4 mt-8">Details</h3>
              <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                <div style={{backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', border: '1px solid #eee'}}>
                  <small className="font-bold text-gray-500" style={{textTransform: 'uppercase'}}>Fee</small>
                  <p className="font-bold" style={{fontSize: '18px'}}>Rs. {fee} / {feeUnit}</p>
                </div>
                <div style={{backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', border: '1px solid #eee'}}>
                  <small className="font-bold text-gray-500" style={{textTransform: 'uppercase'}}>Location</small>
                  <p className="font-bold" style={{fontSize: '18px'}}>{location}</p>
                </div>
                <div style={{backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', border: '1px solid #eee'}}>
                  <small className="font-bold text-gray-500" style={{textTransform: 'uppercase'}}>Time</small>
                  <p className="font-bold" style={{fontSize: '18px'}}>{preferredTime || 'Flexible'}</p>
                </div>
                <div style={{backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', border: '1px solid #eee'}}>
                  <small className="font-bold text-gray-500" style={{textTransform: 'uppercase'}}>Days</small>
                  <p className="font-bold" style={{fontSize: '18px'}}>{preferredDay || 'Anyday'}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="card" style={{backgroundColor: '#f4f4f4', border: '1px solid #ccc'}}>
                <h3 className="font-bold mb-4">Contact</h3>
                <div style={{marginBottom: '15px'}}>
                  <small className="text-gray-500">Email</small>
                  <p className="font-bold">{user?.email}</p>
                </div>
                
                {showPhone && user?.mobile && (
                  <div style={{marginBottom: '15px'}}>
                    <small className="text-gray-500">Mobile</small>
                    <p className="font-bold">{user.mobile}</p>
                  </div>
                )}

                {!isOwner && !isAdmin && (
                  <div className="flex flex-col gap-3 mt-4">
                    {requestStatus ? (
                      <div className="text-center font-bold" style={{padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px'}}>
                        Status: {requestStatus.toUpperCase()}
                      </div>
                    ) : (
                      <button onClick={handleRequestGig} disabled={processing} className="btn btn-primary" style={{width: '100%'}}>
                        {processing ? 'Sending...' : 'Request Gig'}
                      </button>
                    )}
                    <button onClick={handleContact} className="btn btn-outline" style={{width: '100%'}}>
                      Message Now
                    </button>
                  </div>
                )}
                
                {isOwner && (
                    <button onClick={() => navigate(`/edit-service/${id}`)} className="btn btn-primary mt-4" style={{width: '100%'}}>
                        Edit My Service
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;