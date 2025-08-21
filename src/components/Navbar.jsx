import React, { useState } from "react";
import {
  Home,
  ShoppingCart,
  IndianRupee,
  Users,
  BarChart,
  User,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/purchase", label: "Purchase", icon: ShoppingCart },
    { to: "/sale", label: "Sale", icon: IndianRupee },
    { to: "/customer", label: "Customers", icon: Users },
    { to: "/analytics", label: "Analytics", icon: BarChart },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLinks = ({ onClick }) => (
    <ul className="nav nav-pills flex-column mb-auto">
      {navItems.map(({ to, label, icon: Icon }) => (
        <li key={to} className="nav-item mb-2">
          <Link
            to={to}
            onClick={onClick}
            className={`nav-link d-flex align-items-center ${
              location.pathname === to ? "active" : "text-dark"
            }`}
          >
            <Icon size={20} className="me-2" /> {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* ----------- Desktop Sidebar (md and up) ----------- */}
      <div
        className="d-none d-md-flex flex-column p-3 bg-light border-end vh-100 position-fixed"
        style={{ width: "260px", top: 0, left: 0 }}
      >
        {/* Logo and Brand */}
        <div className="d-flex align-items-center mb-4">
          <img src={logo} alt="Brand Logo" width={36} height={36} className="me-2" />
          <span className="fs-4 fw-bold">Digi Data</span>
        </div>

        {/* Navigation */}
        <NavLinks />

        {/* Profile Info */}
        <div className="mt-auto pt-4 border-top">
          {currentUser ? (
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center text-dark text-decoration-none mb-2">
                <Link
                  to="/profile"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/profile" ? "active" : "text-dark"
                  }`}
                >
                  <User size={20} className="me-2" />
                </Link>
                <span>{currentUser.ownerName || currentUser.businessName}</span>
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center text-dark text-decoration-none">
              <User size={24} className="me-2" />
              <span>Guest User</span>
            </div>
          )}
        </div>
      </div>

      {/* ----------- Mobile Layout (below md) ----------- */}
      <div className="d-md-none">
        {/* Top Header */}
        {/* Top Header */}
<div
  className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-light w-100"
  style={{ position: "fixed", top: 0, left: 0, zIndex: 1040 }}
>
  <div className="d-flex align-items-center">
    <img src={logo} alt="Logo" width={36} height={36} className="me-2" />
    <span className="fw-bold">Digi Pocket</span>
  </div>
  <div className="d-flex align-items-center">
                    <Link
                  to="/profile"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/profile" ? "active" : "text-dark"
                  }`}
                >
    <User size={24} className="me-2" />
    <span style={{ fontSize: "0.9rem" }}>
      {currentUser?.businessName || "Guest"}
    </span>
    </Link>
  </div>
</div>


        {/* Bottom Sticky Nav */}
        <nav
          className="navbar fixed-bottom bg-white border-top d-flex justify-content-around"
          style={{ height: "60px" }}
        >
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`text-center text-decoration-none ${
                  isActive ? "text-primary" : "text-secondary"
                }`}
                style={{ fontSize: "0.75rem" }}
              >
                <Icon size={20} className="d-block mx-auto mb-1" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
