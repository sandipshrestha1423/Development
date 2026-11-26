import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api"; 
import { useAuth } from "../context/AuthContext"; 

function LandingPage() {
  const [services, setServices] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  
  const navigate = useNavigate(); 
  const { user } = useAuth(); 

  const handleServiceClick = (service) => {
      if (user && service.user && user.id === service.user._id) {
          navigate('/profile');
      } else {
          navigate(`/service/${service._id}`);
      }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        const validServices = response.data.filter(s => s.user);
        setServices(validServices);
      } catch (err) {
        setError("Oops! We couldn't load the services right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="landing-page">
      <section className="section hero">
        <div className="container">
          <h1>Find Help. Offer Skills. All Nearby.</h1>
          <p>
            Kaarya helps you find services in your neighborhood. Whether you need a repair, a tutor, or a helping hand, find it here or offer your own skills.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="btn btn-primary">
              Explore Services
            </Link>
            <Link to="/register" className="btn btn-outline">
              Post a Service
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <p className="text-center font-bold text-gray-500 mb-8">
            Popular Categories
          </p>
          <div className="flex justify-center gap-4">
            {["Tutoring", "Repairs", "Deliveries", "Tech Help", "Cleaning", "Events", "Gardening"].map(
              (cat, i) => (
                <div key={i} className="btn">
                  {cat}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-2xl font-bold">Latest Services</h2>
            <p className="text-gray-500">See what your neighbors are offering or looking for.</p>
          </div>

          {loading && <p className="text-center">Loading services...</p>}
          
          {error && <p className="text-center" style={{color: 'red'}}>{error}</p>}

          {!loading && services.length === 0 && !error && (
            <div className="card text-center">
               <p>No services posted yet. Be the first!</p>
               <Link to="/register" className="mt-4 inline-block font-bold">Sign up to post</Link>
            </div>
          )}

          <div className="grid grid-3">
            {services.map((service) => (
              <div key={service._id} onClick={() => handleServiceClick(service)} className="card" style={{cursor: 'pointer'}}>
                <div className="card-body">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold">{service.category}</span>
                    <span className="text-gray-500">{service.type}</span>
                  </div>
                  <h3 className="font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-500 mb-4">{service.description}</p>
                </div>
                
                <div className="card-footer">
                  <div className="flex items-center gap-4">
                    <div style={{width: '30px', height: '30px', backgroundColor: '#ddd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      {service.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <span className="font-bold">{service.user?.name || "User"}</span><br/>
                      <small className="text-gray-500">Location: {service.location}</small>
                    </div>
                  </div>
                  <div className="font-bold">Rs. {service.fee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-12">How Kaarya Works</h2>
          <div className="grid grid-3">
            {[
              { title: "1. Create an Account", desc: "Sign up in seconds to start exploring or posting services in your area." },
              { title: "2. Find or Post", desc: "Browse local listings for help you need, or create a post to offer your own skills." },
              { title: "3. Connect & Solve", desc: "Get in touch, get the job done, and build a stronger local community." },
            ].map((step, i) => (
              <div key={i} className="card">
                <h3 className="font-bold mb-4">{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section text-center" style={{backgroundColor: '#333', color: 'white'}}>
        <div className="container">
          <h2 className="text-2xl font-bold mb-4">Join your community</h2>
          <p className="mb-4">Sign up for Kaarya today and start making connections in your neighborhood.</p>
          <Link to="/register" className="btn" style={{backgroundColor: 'white', color: '#333'}}>
              Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;