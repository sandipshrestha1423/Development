import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalHandshakes: 0,
    pendingServices: 0,
    pendingUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      const admin = localStorage.getItem("admin");
      if (!admin) {
          navigate("/admin-login");
      }
      fetchData();
  }, []);

  const fetchData = async () => {
      try {
          const statsRes = await api.get("/admin/stats");
          setStats(statsRes.data);

          const usersRes = await api.get("/admin/pending-users");
          setUsers(usersRes.data);

          const servicesRes = await api.get("/admin/pending-services");
          setServices(servicesRes.data);
      } catch (err) {
          console.error("Failed to fetch admin data", err);
      } finally {
          setLoading(false);
      }
  };

  const handleUserAction = async (userId, status) => {
      try {
          await api.post("/admin/verify-user", { userId, status });
          setUsers(users.filter(u => u._id !== userId));
          fetchData();
      } catch (err) {
          alert("Action failed");
      }
  };

  const handleServiceAction = async (serviceId, status) => {
      try {
          await api.post("/admin/verify-service", { serviceId, status });
          setServices(services.filter(s => s._id !== serviceId));
          fetchData();
      } catch (err) {
          alert("Action failed");
      }
  };

  const handleLogout = async () => {
      await api.post("/admin/logout");
      localStorage.removeItem("admin");
      navigate("/admin-login");
  };

  if (loading) return <div className="section"><p className="text-center">Loading Dashboard...</p></div>;

  return (
    <div className="section">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
            <h1 className="font-bold">Admin Dashboard</h1>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
        </div>

        <div className="grid mb-12" style={{gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px'}}>
            <div className="card text-center" style={{padding: '20px'}}>
                <h3 className="text-gray-500" style={{fontSize: '14px', marginBottom: '10px'}}>Total Users</h3>
                <p className="font-bold" style={{fontSize: '24px'}}>{stats.totalUsers}</p>
            </div>
            <div className="card text-center" style={{padding: '20px'}}>
                <h3 className="text-gray-500" style={{fontSize: '14px', marginBottom: '10px'}}>Total Services</h3>
                <p className="font-bold" style={{fontSize: '24px'}}>{stats.totalServices}</p>
            </div>
            <div className="card text-center" style={{padding: '20px'}}>
                <h3 className="text-gray-500" style={{fontSize: '14px', marginBottom: '10px'}}>Handshakes</h3>
                <p className="font-bold" style={{fontSize: '24px'}}>{stats.totalHandshakes}</p>
            </div>
            <div className="card text-center" style={{padding: '20px'}}>
                <h3 className="text-gray-500" style={{fontSize: '14px', marginBottom: '10px'}}>Pending Tasks</h3>
                <p className="font-bold" style={{fontSize: '24px', color: '#dc2626'}}>{stats.pendingServices + stats.pendingUsers}</p>
            </div>
        </div>

        <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
            
            <div className="card">
                <h2 className="font-bold mb-6">Pending Users ({users.length})</h2>
                <div className="flex flex-col gap-4">
                    {users.length === 0 && <p className="text-gray-500">No pending users.</p>}
                    {users.map(user => (
                        <div key={user._id} className="card" style={{backgroundColor: '#f9f9f9', padding: '15px'}}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{user.name}</p>
                                    <p className="text-gray-500" style={{fontSize: '14px'}}>{user.email}</p>
                                    <p className="text-gray-500" style={{fontSize: '14px'}}>{user.mobile || "No Mobile"}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleUserAction(user._id, 'active')}
                                        className="btn btn-primary" style={{padding: '5px 10px'}}>
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleUserAction(user._id, 'rejected')}
                                        className="btn" style={{padding: '5px 10px', color: 'red', borderColor: 'red'}}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h2 className="font-bold mb-6">Pending Services ({services.length})</h2>
                <div className="flex flex-col gap-4">
                    {services.length === 0 && <p className="text-gray-500">No pending services.</p>}
                    {services.map(service => (
                        <div key={service._id} className="card" style={{backgroundColor: '#f9f9f9', padding: '15px'}}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold" style={{fontSize: '16px'}}>{service.title}</h3>
                                    <p className="text-gray-500" style={{fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'}}>{service.category}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleServiceAction(service._id, 'active')}
                                        className="btn btn-primary" style={{padding: '5px 10px'}}>
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleServiceAction(service._id, 'rejected')}
                                        className="btn" style={{padding: '5px 10px', color: 'red', borderColor: 'red'}}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-500 mb-4" style={{fontSize: '14px'}}>{service.description}</p>
                            <div className="text-gray-500" style={{fontSize: '11px'}}>
                                Posted by: {service.user?.name || "Unknown"} | Mobile: {service.user?.mobile || "N/A"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;