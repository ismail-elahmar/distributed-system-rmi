import React, { useState, useRef } from "react";
import "../SignIn.css";
import logo from "./assets/logo.png";
import { FaArrowLeft } from "react-icons/fa";
import Catalogue from "./pages/Catalogue";

function OwnerPage({ userData, onSignOut, onSwitchToClient, onUpdateUserData }) {
  const [activeTab, setActiveTab] = useState("home");
  const [clientMode, setClientMode] = useState(() => {
    // Check if client mode is stored in localStorage
    const stored = localStorage.getItem(`carrent_client_mode_${userData?.id}`);
    return stored === "true";
  });
  const fileInputRef = useRef(null);

  // Get user initials for avatar
  const getInitials = () => {
    if (userData?.name) {
      const names = userData.name.split(" ");
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return userData.name.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Handle profile picture change
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const updatedUserData = {
        ...userData,
        profilePicture: base64String
      };

      // Update localStorage
      localStorage.setItem("carrent_current_user", JSON.stringify(updatedUserData));
      
      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("carrent_users") || "[]");
      const userIndex = users.findIndex(u => u.id === userData.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], profilePicture: base64String };
        localStorage.setItem("carrent_users", JSON.stringify(users));
      }

      // Notify parent component
      if (onUpdateUserData) {
        onUpdateUserData(updatedUserData);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePictureClick = () => {
    fileInputRef.current?.click();
  };

  const renderHomeView = () => (
    <div className="owner-content" style={{ padding: 0, margin: 0 }}>
      {/* Home content will be added here */}
    </div>
  );

  const renderAccountView = () => (
    <div className="owner-content" style={{ padding: 0, margin: 0 }}>
      <div className="signin-header">
        <h2 className="signin-title signup-title-purple">Account</h2>
        <p className="signin-subtitle">
          Manage your account settings and profile.
        </p>
      </div>
      <div style={{ padding: "20px 0" }}>
        {userData && (
          <>
            {/* Profile Picture Section */}
            <div className="account-profile-section">
              <div className="account-profile-avatar">
                {userData.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="account-profile-img"
                  />
                ) : (
                  <span className="account-profile-initials">{getInitials()}</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="change-picture-button"
                onClick={handleChangePictureClick}
              >
                {userData.profilePicture ? "Change Picture" : "Add Picture"}
              </button>
            </div>

            <div className="account-info-item">
              <p className="account-info-label">Name:</p>
              <p className="account-info-value">
                {userData.name}
              </p>
            </div>
            <div className="account-info-item">
              <p className="account-info-label">Email:</p>
              <p className="account-info-value">
                {userData.email}
              </p>
            </div>
            <div className="account-info-item">
              <p className="account-info-label">Role:</p>
              <p className="account-info-value">
                Car Owner
              </p>
            </div>
          </>
        )}
        {onSignOut && (
          <button
            type="button"
            className="signin-button"
            onClick={onSignOut}
            style={{ marginTop: "20px", width: "100%" }}
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="owner-page" style={{ padding: 0, margin: 0 }}>
      {/* Client Mode Switch Banner */}
      {activeTab === "home" && (
        <div className="client-mode-banner">
          <span className="client-mode-text">Wanna rent a car? switch to client mode</span>
          <label className="client-mode-toggle">
            <input
              type="checkbox"
              checked={clientMode}
              onChange={(e) => {
                const isClientMode = e.target.checked;
                setClientMode(isClientMode);
                // Store client mode preference in localStorage
                if (userData?.id) {
                  localStorage.setItem(`carrent_client_mode_${userData.id}`, isClientMode.toString());
                }
                // Notify parent if needed (but don't switch pages - owner stays on owner page)
                if (onSwitchToClient) {
                  onSwitchToClient(isClientMode);
                }
              }}
            />
            <span className="client-mode-slider"></span>
          </label>
        </div>
      )}

      {activeTab === "home" ? (
        clientMode ? (
          <div style={{ marginTop: "20px", width: "100%" }}>
            <Catalogue />
          </div>
        ) : (
          renderHomeView()
        )
      ) : (
        <div className="signin-card owner-card">
          {renderAccountView()}
        </div>
      )}
    </div>
  );
}

export default OwnerPage;

