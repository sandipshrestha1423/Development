import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePostClick = () => {
    if (user) {
      navigate("/post-service");
    } else {
      navigate("/login");
    }
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const linkClass = (path) =>
    `nav-link ${location.pathname === path ? "active" : ""}`;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="flex justify-between items-center">
          
            <Link to="/" className="text-2xl font-bold text-accent">
            Kaarya
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass("/")}>Home</Link>
            <Link to="/about" className={linkClass("/about")}>About</Link>
            <Link to="/how-it-works" className={linkClass("/how-it-works")}>How It Works</Link>

            <button onClick={handlePostClick} className="btn btn-primary">
              Post a Service
            </button>

            {user ? (
              <ProfileMenu />
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-outline">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-4">
            {user && <ProfileMenu />}
            
            <button onClick={() => setIsOpen(!isOpen)} className="btn btn-ghost p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 p-4 shadow-md">
          <div className="flex flex-col gap-4">
            <Link to="/" className={linkClass("/")} onClick={closeMobileMenu}>Home</Link>
            <Link to="/about" className={linkClass("/about")} onClick={closeMobileMenu}>About</Link>
            <Link to="/how-it-works" className={linkClass("/how-it-works")} onClick={closeMobileMenu}>How It Works</Link>

            <button
              onClick={() => { handlePostClick(); closeMobileMenu(); }}
              className="btn btn-primary w-full"
            >
              Post a Service
            </button>

            {!user && (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="btn btn-outline" onClick={closeMobileMenu}>Login</Link>
                <Link to="/register" className="btn btn-outline" onClick={closeMobileMenu}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;