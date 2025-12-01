import React, { useState } from "react";
import "../SignIn.css";
import logo from "./assets/logo.png";

/**
 * Sign-up page with the same white + purple style as SignIn.
 * Adjust the URL/body to match your Spring Boot registration endpoint.
 */
function SignUp({ onSignedUp, onGoToSignIn }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [identity, setIdentity] = useState("client"); // "client" | "owner"
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword || !identity) {
      setError("Please fill in all fields and choose how you will use CarRent.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Adjust URL to match your Spring Boot sign-up controller, e.g.:
      // @PostMapping("/api/auth/register")
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          role: identity, // e.g. "client" or "owner"
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      if (onSignedUp) {
        onSignedUp(data);
      }
    } catch (err) {
      setError("Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="signin-title signup-title-purple">Create account</h2>
          <p className="signin-subtitle">
            Sign up to manage your rentals and save your favourite cars.
          </p>
        </div>

        {error && <div className="signin-error">{error}</div>}

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-field">
            <label className="signin-label" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              className="signin-input"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="signin-field">
            <label className="signin-label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              className="signin-input"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="signin-field">
            <label className="signin-label" htmlFor="signup-password">
              Password
            </label>
            <div className="signin-password-wrapper">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                className="signin-password-input"
                placeholder="Create a password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="signin-toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="signin-field">
            <label className="signin-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="signin-input"
              placeholder="Repeat your password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="signin-field">
            <span className="signin-label">I will use CarRent as</span>
            <div className="identity-row">
              <label className={`identity-pill ${identity === "client" ? "identity-pill--active" : ""}`}>
                <input
                  type="radio"
                  name="identity"
                  value="client"
                  checked={identity === "client"}
                  onChange={(e) => setIdentity(e.target.value)}
                />
                Client
              </label>
              <label className={`identity-pill ${identity === "owner" ? "identity-pill--active" : ""}`}>
                <input
                  type="radio"
                  name="identity"
                  value="owner"
                  checked={identity === "owner"}
                  onChange={(e) => setIdentity(e.target.value)}
                />
                Owner
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="signin-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="signin-footer">
          Already have an account?{" "}
          <button
            type="button"
            className="signin-link"
            onClick={onGoToSignIn}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;


