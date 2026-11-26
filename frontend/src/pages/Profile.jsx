import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import LocationPicker from "../components/LocationPicker";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
      name: "",
      mobile: "",
  });
  const [newLocation, setNewLocation] = useState(null); 
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if (user) {
          setEditForm({
              name: user.name || "",
              mobile: user.mobile || "",
          });
      }
  }, [user]);

  const handleEditChange = (e) => {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          setProfileImage(e.target.files[0]);
      }
  };
  
  const handleLocationSelect = (loc) => {
      setNewLocation(loc);
  };

  const saveProfile = async () => {
      setLoading(true);
      try {
          const formData = new FormData();
          formData.append('name', editForm.name);
          formData.append('mobile', editForm.mobile);
          
          if (newLocation) {
              formData.append('location', JSON.stringify(newLocation));
          }
          if (profileImage) {
              formData.append('profileImage', profileImage);
          }
          
          const res = await api.put('/auth/profile', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data', 
              },
          });

          updateUser(res.data.user);
          setIsEditing(false); 
          alert("Profile Updated Successfully!");

      } catch (err) {
          alert("Failed to update profile.");
      } finally {
          setLoading(false);
      }
  };

  const getProfileImageUrl = () => {
      if (user?.profileImage) {
          return `http://localhost:5000/${user.profileImage}`; 
      }
      return null;
  };

  return (
    <div className="section">
      <div className="container" style={{maxWidth: '800px'}}>
        <div className="card">
          <div className="flex justify-between items-center mb-8" style={{borderBottom: '1px solid #eee', paddingBottom: '15px'}}>
            <h1 className="font-bold">My Profile</h1>
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-outline"
            >
                {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {!isEditing ? (
              <div className="flex flex-col md:flex-row gap-8">
                  <div style={{textAlign: 'center'}}>
                      <div style={{width: '120px', height: '120px', backgroundColor: '#ddd', borderRadius: '50%', margin: '0 auto 15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold'}}>
                          {getProfileImageUrl() ? (
                              <img src={getProfileImageUrl()} alt="Profile" style={{width: '100%', height: '100%', objectCover: 'cover'}} />
                          ) : (
                              user?.name?.charAt(0).toUpperCase() || "?"
                          )}
                      </div>
                  </div>
                  <div>
                      <h2 className="font-bold">{user?.name}</h2>
                      <p className="text-gray-500">{user?.email}</p>
                      <p className="mt-4"><strong>Mobile:</strong> {user?.mobile || 'Not set'}</p>
                      <p className="mt-2"><strong>Location:</strong> {user?.location?.address || 'Not set'}</p>
                      
                      <div className="mt-6 flex gap-2">
                          <span className="btn" style={{fontSize: '12px', padding: '4px 8px', backgroundColor: '#f0f0f0', border: 'none'}}>Verified Member</span>
                          {user?.roles?.map((role, idx) => (
                              <span key={idx} className="btn" style={{fontSize: '12px', padding: '4px 8px', backgroundColor: '#f0f0f0', border: 'none', textTransform: 'capitalize'}}>{role}</span>
                          ))}
                      </div>
                  </div>
              </div>
          ) : (
              <div style={{maxWidth: '500px'}}>
                  <div className="form-group">
                      <label>Profile Picture</label>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                  </div>

                  <div className="form-group">
                      <label>Full Name</label>
                      <input 
                          type="text" 
                          name="name" 
                          value={editForm.name} 
                          onChange={handleEditChange}
                      />
                  </div>

                  <div className="form-group">
                      <label>Mobile Number</label>
                      <input 
                          type="text" 
                          name="mobile" 
                          value={editForm.mobile} 
                          onChange={handleEditChange}
                      />
                  </div>

                  <div className="form-group">
                      <label>Update Location <small>(Click on map to select)</small></label>
                      <div style={{height: '200px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden'}}>
                           <LocationPicker 
                                onLocationSelect={handleLocationSelect} 
                                initialPosition={user?.location?.coordinates ? { lat: user.location.coordinates[1], lng: user.location.coordinates[0] } : null} 
                           />
                      </div>
                  </div>

                  <button 
                      onClick={saveProfile}
                      disabled={loading}
                      className="btn btn-primary"
                      style={{width: '100%', marginTop: '20px'}}
                  >
                      {loading ? "Saving..." : "Save Changes"}
                  </button>
              </div>
          )}
        </div>

        <div className="grid" style={{gridTemplateColumns: '1fr 2fr', gap: '20px', marginTop: '20px'}}>
            <div className="card">
                <h3 className="font-bold mb-4">Stats</h3>
                <p><strong>Services:</strong> 0</p>
                <p><strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="card">
                <h3 className="font-bold mb-4">Recent Activity</h3>
                <p className="text-gray-500">No recent activity to show.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;