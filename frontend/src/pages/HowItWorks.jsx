import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HowItWorks() {
  const [activeTab, setActiveTab] = useState('seeker'); 

  return (
    <div className="how-it-works-page">
      
      <section className="section hero">
        <div className="container">
          <h1>Simple. Fast. Local.</h1>
          <p>
            Kaarya makes it easy to connect with people nearby. Here is how it works.
          </p>
        </div>
      </section>

      <section className="section bg-white" style={{padding: '20px 0'}}>
        <div className="container text-center">
            <div className="flex justify-center gap-4">
                <button 
                    onClick={() => setActiveTab('seeker')}
                    className={`btn ${activeTab === 'seeker' ? 'btn-primary' : 'btn-outline'}`}
                >
                    I Need Help
                </button>
                <button 
                    onClick={() => setActiveTab('poster')}
                    className={`btn ${activeTab === 'poster' ? 'btn-primary' : 'btn-outline'}`}
                >
                    I Want to Earn
                </button>
            </div>
        </div>
      </section>

      <section className="section">
          <div className="container" style={{maxWidth: '800px'}}>
              {activeTab === 'seeker' ? (
                  <div className="flex flex-col gap-8">
                      {[
                          { num: 1, title: "Search Services", desc: "Browse through categories like Repairs, Tutoring, or Cleaning to find what you need in your area." },
                          { num: 2, title: "Connect", desc: "View profiles and contact the service provider directly." },
                          { num: 3, title: "Get it Done", desc: "Agree on a time and price, get your task completed, and pay the provider." }
                      ].map((step) => (
                          <div key={step.num} className="card">
                              <div className="flex items-center gap-6">
                                  <div style={{width: '50px', height: '50px', backgroundColor: '#333', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold'}}>
                                      {step.num}
                                  </div>
                                  <div>
                                      <h3 className="font-bold mb-2">{step.title}</h3>
                                      <p>{step.desc}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="flex flex-col gap-8">
                      {[
                          { num: 1, title: "Post a Service", desc: "Create a listing describing your skills and what you offer." },
                          { num: 2, title: "Get Noticed", desc: "Your service becomes visible to people in your neighborhood." },
                          { num: 3, title: "Start Earning", desc: "Receive inquiries, complete tasks, and build your reputation." }
                      ].map((step) => (
                          <div key={step.num} className="card">
                              <div className="flex items-center gap-6">
                                  <div style={{width: '50px', height: '50px', backgroundColor: '#333', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold'}}>
                                      {step.num}
                                  </div>
                                  <div>
                                      <h3 className="font-bold mb-2">{step.title}</h3>
                                      <p>{step.desc}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </section>

      <section className="section bg-white">
          <div className="container" style={{maxWidth: '800px'}}>
              <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
              <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div className="card">
                      <h4 className="font-bold mb-2">Is it free to join?</h4>
                      <p>Yes, creating an account and browsing services is free.</p>
                  </div>
                  <div className="card">
                      <h4 className="font-bold mb-2">How do I pay?</h4>
                      <p>Payments are handled directly between users after the job is done.</p>
                  </div>
              </div>
          </div>
      </section>

      <section className="section text-center" style={{backgroundColor: '#333', color: 'white'}}>
        <div className="container">
          <h2 className="text-2xl font-bold mb-4">Join your community</h2>
          <p className="mb-8">Sign up for Kaarya today and start connecting with your neighbors.</p>
          <Link to="/register" className="btn" style={{backgroundColor: 'white', color: '#333'}}>
             Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;