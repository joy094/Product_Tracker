import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ auth, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // বর্তমান পেজ চেক করার জন্য

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* ১. প্রধান নেভিগেশন (বড় স্ক্রিন ও মোবাইলের উপরের অংশ) */}
      <nav className="navbar">
        <div className="navbar-content">
          <h2 className="logo">🚚 ডেমোকার্গো</h2>

          {/* হ্যামবার্গার মেনু - ছোট ডিভাইসে উপরের ডানদিকে থাকবে */}
          <div className="menu-icon" onClick={toggleMenu}>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
          </div>

          <div className={`nav-links ${isOpen ? "open" : ""}`}>
            <Link to="/" onClick={toggleMenu}>
              ট্র্যাকিং
            </Link>

            {auth?.token ? (
              <>
                <Link to="/admin" onClick={toggleMenu}>
                  অ্যাডমিন ড্যাশবোর্ড
                </Link>
                <span className="user-email">{auth.email}</span>
                <button
                  className="logout-button"
                  onClick={() => {
                    onLogout();
                    toggleMenu();
                  }}
                >
                  লগআউট
                </button>
              </>
            ) : (
              <Link to="/login" onClick={toggleMenu}>
                অ্যাডমিন লগইন
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ২. মোবাইল বটম নেভিগেশন (শুধুমাত্র ছোট স্ক্রিনের জন্য) */}
      <div className="bottom-nav">



        <Link
          to="/"
          className={`bottom-nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <span className="icon">
            <i class="fa-solid fa-home"></i>
          </span>
          <span className="text">হোম</span>
        </Link>
        <Link
          to="/"
          className={`bottom-nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <span className="icon">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <span className="text">ট্র্যাকিং</span>
        </Link>

        {auth?.token ? (
          <>
            <Link
              to="/admin"
              className={`bottom-nav-item ${location.pathname === "/admin" ? "active" : ""}`}
            >
              <span className="icon">
                <i class="fa-solid fa-gauge-high"></i>
              </span>
              <span className="text">ড্যাশবোর্ড</span>
            </Link>
            <button
              onClick={onLogout}
              className="bottom-nav-item logout-btn-mobile"
            >
              <span className="icon">
                <i class="fa-solid fa-right-from-bracket"></i>
              </span>
              <span className="text">লগআউট</span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`bottom-nav-item ${location.pathname === "/login" ? "active" : ""}`}
          >
            <span className="icon">
              <i class="fa-solid fa-user"></i>
            </span>
            <span className="text">লগইন</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
