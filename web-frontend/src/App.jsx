import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";
import OwnerPage from "./OwnerPage.jsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Catalogue from "./pages/Catalogue";
import ReservationPage from "./pages/ReservationPage";
import ProfilePage from "./pages/ProfilePage";
import MyBookings from "./pages/MyBookings";
import CarDetailsPage from "./pages/CarDetailsPage";

// Protected Route Component (Reste inchangé)
function ProtectedRoute({ children, requireRole }) {
  const currentUser = localStorage.getItem("carrent_current_user");
  
  if (!currentUser) {
    // Si on essaie d'accéder à une page protégée (ex: Reservation), on redirige vers le login
    return <Navigate to="/signin" replace />;
  }

  try {
    const user = JSON.parse(currentUser);
    if (requireRole && user.role !== requireRole && user.role !== requireRole.toUpperCase()) {
      localStorage.removeItem("carrent_current_user");
      return <Navigate to="/signin" replace />;
    }
    return children;
  } catch (err) {
    localStorage.removeItem("carrent_current_user");
    return <Navigate to="/signin" replace />;
  }
}

// 🔹 MODIFICATION ICI : Gestion intelligente de la redirection après connexion
function SignInPage() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("carrent_current_user");
  
  // Si déjà connecté, on redirige
  useEffect(() => {
    if (currentUser) {
      navigate("/catalogue", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSignedIn = (data) => {
    localStorage.setItem("carrent_current_user", JSON.stringify(data));
    
    // 1. Vérifier si une redirection est en attente (venant de DetailsModal)
    const redirectUrl = sessionStorage.getItem("redirectAfterLogin");

    if (redirectUrl) {
      // 2. Si oui, on nettoie et on redirige vers la réservation
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectUrl);
    } else {
      // 3. Sinon, comportement par défaut
      if (data.role === "client" || data.role === "CLIENT") {
        navigate("/catalogue");
      } else if (data.role === "owner" || data.role === "OWNER") {
        navigate("/owner");
      }
    }
  };

  return (
    <SignIn 
      onSignedIn={handleSignedIn}
      onGoToSignUp={() => navigate("/signup")}
    />
  );
}

// 🔹 MODIFICATION ICI : Même logique pour le Sign Up
function SignUpPage() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("carrent_current_user");
  
  useEffect(() => {
    if (currentUser) {
      navigate("/catalogue", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSignedUp = (data) => {
    localStorage.setItem("carrent_current_user", JSON.stringify(data));
    
    // Vérification de redirection après inscription
    const redirectUrl = sessionStorage.getItem("redirectAfterLogin");

    if (redirectUrl) {
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectUrl);
    } else {
      if (data.role === "client" || data.role === "CLIENT") {
        navigate("/catalogue");
      } else if (data.role === "owner" || data.role === "OWNER") {
        navigate("/owner");
      } else {
        navigate("/signin");
      }
    }
  };

  return (
    <SignUp
      onSignedUp={handleSignedUp}
      onGoToSignIn={() => navigate("/signin")}
    />
  );
}

// Layouts (Restent inchangés)
function ClientLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-6 md:pt-6 min-h-screen dark:!bg-[#1a0f24] bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300">
        {children}
      </div>
      <Footer />
    </>
  );
}

function OwnerLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen dark:!bg-[#1a0f24] bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300" style={{ padding: 0, margin: 0 }}>
        {children}
      </div>
      <Footer />
    </>
  );
}

// Error Boundary (Reste inchangé)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f3ff', padding: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Something went wrong</h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ padding: '12px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// 🔹 CONFIGURATION DES ROUTES
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* 1. Routes d'authentification (Dé-commentées) */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* 2. Route par défaut : Redirige vers le Catalogue (Public) au lieu du Login */}
          <Route path="/" element={<Navigate to="/catalogue" replace />} />

          {/* 3. Catalogue : Accessible à TOUS (Pas de ProtectedRoute) */}
          <Route
            path="/catalogue"
            element={
              <ClientLayout>
                <Catalogue />
              </ClientLayout>
            }
          />

          {/* 4. Détails voiture : Accessible à TOUS */}
          <Route
            path="/car/:carId"
            element={
              <ClientLayout>
                <CarDetailsPage />
              </ClientLayout>
            }
          />

          {/* 5. Réservation : PROTÉGÉE (Nécessite connexion) */}
          {/* C'est ici que le système va rediriger vers /signin si pas connecté */}
          <Route
            path="/reservation/:carId"
            element={
              <ProtectedRoute requireRole="client">
                <ClientLayout>
                  <ReservationPage />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          {/* Autres routes protégées */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requireRole="client">
                <ClientLayout>
                  <ProfilePage />
                </ClientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute requireRole="client">
                <ClientLayout>
                  <MyBookings />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          {/* Owner Route */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute requireRole="owner">
                <OwnerLayout>
                  <OwnerPage 
                    userData={(() => {
                      try {
                        const user = localStorage.getItem("carrent_current_user");
                        return user ? JSON.parse(user) : null;
                      } catch { return null; }
                    })()} 
                    onSignOut={() => {
                      localStorage.removeItem("carrent_current_user");
                      window.location.href = "/signin";
                    }}
                  />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />

          {/* Logout Route */}
          <Route
            path="/logout"
            element={
              <Navigate to="/signin" replace state={{ logout: true }} />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/catalogue" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;