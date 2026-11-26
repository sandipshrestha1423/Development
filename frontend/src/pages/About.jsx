import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-page">
      <section className="section hero">
        <div className="container">
          <h1>Connecting Neighbors,<br /> Building Community.</h1>
          <p>
            Kaarya is a platform built to help people find services in their own neighborhood. We make it easy to offer your skills or find help nearby.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center', gap: '40px'}}>
            <div>
              <div className="card" style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee'}}>
                <span className="text-gray-500 font-bold">[Community Image Placeholder]</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="mb-4" style={{lineHeight: '1.6'}}>
                Kaarya was started to bring local connections back. We believe everyone has a skill to share and everyone needs help at some point.
              </p>
              <p style={{lineHeight: '1.6'}}>
                Whether you need a tutor, a plumber, or a helping hand, you can find it right in your neighborhood through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-12">Core Values</h2>
            <div className="grid grid-3">
                {[
                    { title: "Trust & Safety", desc: "We focus on safety with verified profiles and secure interactions." },
                    { title: "Community First", desc: "We build features that help people connect with their neighbors." },
                    { title: "Accessibility", desc: "Help should be available to everyone in the community." }
                ].map((value, idx) => (
                    <div key={idx} className="card text-center">
                        <h3 className="font-bold mb-4">{value.title}</h3>
                        <p>{value.desc}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>

      <section className="section text-center" style={{backgroundColor: '#333', color: 'white'}}>
        <div className="container">
          <h2 className="text-2xl font-bold mb-4">Join your community today</h2>
          <p className="mb-8">Sign up for Kaarya and start connecting with people in your neighborhood.</p>
          <Link to="/register" className="btn" style={{backgroundColor: 'white', color: '#333'}}>
             Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;