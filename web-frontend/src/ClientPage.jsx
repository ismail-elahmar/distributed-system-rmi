import React from "react";
import "../SignIn.css";
import logo from "./assets/logo.png";

function ClientPage({ userData, onSignOut }) {
  return (
    <div className="signin-page">
      <div className="app-brand">
        <img src={logo} alt="CarRent logo" className="app-logo" />
        <span className="app-brand-text">
          CAR<span>RENT</span>
        </span>
      </div>
      <div className="signin-card">
        <div className="signin-header">
          <h2 className="signin-title signup-title-purple">Welcome, Client!</h2>
          <p className="signin-subtitle">
            Browse and rent cars from our available fleet.
          </p>
        </div>
        <div style={{ padding: "20px 0" }}>
          <p>This is the client page where users can rent cars.</p>
          {userData && (
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#6b7280" }}>
              Logged in as: {userData.email || userData.name}
            </p>
          )}
        </div>
        {onSignOut && (
          <button
            type="button"
            className="signin-button"
            onClick={onSignOut}
            style={{ marginTop: "20px" }}
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}

export default ClientPage;




