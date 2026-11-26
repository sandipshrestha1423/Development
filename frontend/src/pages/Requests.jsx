import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Requests = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sent'); 
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const sentRes = await api.get('/gig-requests/requester');
      setSentRequests(sentRes.data);

      const receivedRes = await api.get('/gig-requests/provider');
      setReceivedRequests(receivedRes.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await api.put(`/gig-requests/${requestId}/status`, { status: newStatus });
      setReceivedRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'accepted': return {backgroundColor: '#dcfce7', color: '#16a34a'};
      case 'rejected': return {backgroundColor: '#fee2e2', color: '#dc2626'};
      default: return {backgroundColor: '#fef9c3', color: '#854d0e'};
    }
  };

  if (loading) {
     return <div className="section"><p className="text-center">Loading requests...</p></div>;
  }

  return (
    <div className="section">
      <div className="container" style={{maxWidth: '800px'}}>
        <h1 className="font-bold mb-8">Gig Requests</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('sent')}
            className={`btn ${activeTab === 'sent' ? 'btn-primary' : 'btn-outline'}`}
          >
            Sent Requests
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`btn ${activeTab === 'received' ? 'btn-primary' : 'btn-outline'}`}
          >
            Received Requests
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {activeTab === 'sent' ? (
            sentRequests.length === 0 ? (
               <div className="card text-center">
                  <p className="text-gray-500">You haven't sent any requests yet.</p>
               </div>
            ) : (
              sentRequests.map((request) => (
                <div key={request._id} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{request.service?.title}</h3>
                      <p className="text-gray-500">Provider: {request.provider?.name}</p>
                      <p className="mt-2">Message: "{request.message}"</p>
                      
                      {request.status === 'accepted' && request.provider?.mobile && (
                         <div className="mt-4 p-2 bg-blue-100 rounded" style={{display: 'inline-block'}}>
                             <p className="font-bold" style={{fontSize: '12px'}}>Provider Contact:</p>
                             <p className="font-bold" style={{color: '#007bff'}}>{request.provider.mobile}</p>
                         </div>
                      )}
                    </div>
                    <div style={{...getStatusStyle(request.status), padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'}}>
                      {request.status}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            receivedRequests.length === 0 ? (
               <div className="card text-center">
                  <p className="text-gray-500">You haven't received any requests yet.</p>
               </div>
            ) : (
              receivedRequests.map((request) => (
                <div key={request._id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold">Request for: {request.service?.title}</h3>
                      <p className="text-gray-500">From: {request.requester?.name}</p>
                      <p className="mt-2 italic">"{request.message}"</p>
                    </div>
                    <div style={{...getStatusStyle(request.status), padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'}}>
                      {request.status}
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'accepted')}
                        className="btn btn-primary"
                        style={{flex: 1, backgroundColor: '#28a745', borderColor: '#28a745'}}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'rejected')}
                        className="btn"
                        style={{flex: 1, color: 'red', borderColor: 'red'}}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                       <div className="mt-4 p-3 rounded" style={{backgroundColor: '#dcfce7', border: '1px solid #bbf7d0'}}>
                           <p className="font-bold" style={{color: '#155724', fontSize: '14px'}}>
                               You accepted this request. Please contact the requester:
                           </p>
                           <p className="font-bold" style={{fontSize: '18px', color: '#155724', marginTop: '5px'}}>
                               {request.requester?.mobile || "No mobile number provided"}
                           </p>
                       </div>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;