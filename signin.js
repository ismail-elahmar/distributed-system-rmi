import React, { useState } from "react";
import "./SignIn.css";

/**
 * Sign-in page for the car rent website.
 *
 * This component calls a Spring Boot backend login endpoint.
 * Adjust the URL and response handling to match your backend.
 */
function SignIn({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // very simple email check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // Adjust URL to match your Spring Boot controller, for example:
      // @PostMapping("/api/auth/login")
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      if (!response.ok) {
        // Optionally, read error body from backend
        throw new Error("Bad credentials");
      }

      // Example: backend returns JWT & user info
      const data = await response.json();

      // You can store token in localStorage or cookies here
      // localStorage.setItem("token", data.token);

      if (onSignedIn) {
        onSignedIn(data);
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-header">
          <h2 className="signin-title">Sign in to CarRent</h2>
          <p className="signin-subtitle">
            Access your bookings and find your next ride.
          </p>
        </div>

        {error && <div className="signin-error">{error}</div>}

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-field">
            <label className="signin-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="signin-input"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="signin-field">
            <label className="signin-label" htmlFor="password">
              Password
            </label>
            <div className="signin-password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="signin-password-input"
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
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

          <div className="signin-row">
            <label className="signin-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <button
              type="button"
              className="signin-link"
              onClick={() => {
                // Hook up to your "forgot password" route
                // e.g. navigate("/forgot-password");
                alert("Forgot password flow not implemented yet.");
              }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="signin-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="signin-footer">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="signin-link"
            onClick={() => {
              // Hook up to your sign-up route
              // e.g. navigate("/signup");
              alert("Sign up navigation not implemented yet.");
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;


