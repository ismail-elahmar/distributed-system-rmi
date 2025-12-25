import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "./assets/logo.png";

function SignIn({ onSignedIn, onGoToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark"); else root.classList.remove("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // --- LOGIQUE DE CONNEXION AVEC SPRING BOOT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez saisir votre email et mot de passe.");
      return;
    }

    setLoading(true);

    try {
      // 1. Appel à l'API Spring Boot
      const response = await fetch("http://localhost:2000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // 2. Gestion de la réponse
      if (response.ok) {
        const userData = await response.json();
        
        // userData ressemble à : { id: 1, name: "Ali", email: "...", role: "client", ... }
        
        // 3. Sauvegarde de la session
        localStorage.setItem("carrent_current_user", JSON.stringify(userData));
        if (rememberMe) localStorage.setItem("carrent_remember_me", email);
        else localStorage.removeItem("carrent_remember_me");

        // 4. Notification au composant parent (App.jsx) pour redirection
        if (onSignedIn) {
          onSignedIn(userData);
        }
      } else {
        // Erreur 400 ou 401
        const message = await response.text();
        setError(message || "Email ou mot de passe incorrect.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '32px 24px 40px', background: '#f5f3ff' }}>
      <button onClick={toggleTheme} className="fixed top-4 right-4 z-50 p-2 rounded-lg">
        {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-purple-800" />}
      </button>
      
      <div className="app-brand" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 800, color: '#4c1d95' }}>
        <img src={logo} alt="Logo" style={{ width: '36px' }} />
        CAR<span style={{ color: '#7c3aed' }}>RENT</span>
      </div>

      <div className="signin-card" style={{ maxWidth: '420px', width: '100%', marginTop: '40px', padding: '28px', borderRadius: '20px', background: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div className="signin-header">
          <h2 className="signin-title signup-title-purple">Connexion</h2>
          <p className="signin-subtitle">Accédez à votre espace.</p>
        </div>

        {error && <div className="signin-error" style={{ color: 'red', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-field">
            <label className="signin-label">Email</label>
            <input className="signin-input" type="email" placeholder="nom@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="signin-field">
            <label className="signin-label">Mot de passe</label>
            <div className="signin-password-wrapper">
              <input className="signin-password-input" type={showPassword ? "text" : "password"} placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="signin-toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Cacher" : "Voir"}</button>
            </div>
          </div>

          <div className="signin-row">
            <label className="signin-remember">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Se souvenir de moi
            </label>
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="signin-footer">
          Pas encore de compte ? <button type="button" className="signin-link" onClick={onGoToSignUp}>S'inscrire</button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;