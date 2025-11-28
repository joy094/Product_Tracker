// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import TrackingPage from "./components/TrackingPage";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    email: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    if (token) setAuth({ token, role, email });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, email: null });
  };

  return (
    <Router>
      <Navbar auth={auth} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<TrackingPage />} />

        <Route
          path="/login"
          element={
            auth.token ? (
              <Navigate to={auth.role === "admin" ? "/admin" : "/"} />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/admin"
          element={
            auth.token && auth.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
