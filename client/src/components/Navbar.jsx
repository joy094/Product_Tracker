// src/components/Navbar.jsx - Updated version

import { useState } from "react"; // 1. State hook add করা হয়েছে
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ auth, onLogout }) => {
  // 2. মেনু স্টেট যুক্ত করা হয়েছে
  const [isOpen, setIsOpen] = useState(false); 

  // 3. মেনু টগল ফাংশন
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h2 className="logo">🚚 DemoCargo</h2>

        {/* 4. Hamburger Icon/Button - শুধুমাত্র মোবাইলের জন্য দেখাবে */}
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        </div>

        {/* 5. isOpen স্টেট অনুযায়ী ক্লাস যোগ করা হয়েছে */}
        <div className={`nav-links ${isOpen ? 'open' : ''}`}> 
          {/* all user can see this link */}
          <Link to="/" onClick={toggleMenu}>
            Tracking
          </Link>

          {/* only admin can see this link */}
          {auth?.token ? (
            <>
              <Link to="/admin" onClick={toggleMenu}>
                Admin Dashboard
              </Link>
              {/* Display user email if available */}
              <span className="user-email">{auth.email}</span>

              <button className="logout-button" onClick={() => { onLogout(); toggleMenu(); }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={toggleMenu}>
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;