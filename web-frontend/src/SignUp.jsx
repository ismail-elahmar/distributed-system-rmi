import React, { useState, useRef, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "./assets/logo.png";
import { FaCar, FaHandHoldingUsd, FaArrowLeft, FaUpload, FaChevronDown } from "react-icons/fa";

// Codes pays
const countryCodes = [
  { code: "+212", country: "Maroc", flag: "🇲🇦" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
];

function SignUp({ onSignedUp, onGoToSignIn }) {
  const [step, setStep] = useState(1);
  
  // Champs Communs (User)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [identity, setIdentity] = useState("client"); // "client" ou "owner"
  
  // Téléphone
  const [countryCode, setCountryCode] = useState("+212");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false); // Ajout pour le locateur
  const clientDropdownRef = useRef(null);
  const ownerDropdownRef = useRef(null); // Ajout ref

  // Champs CLIENT
  const [address, setAddress] = useState("");
  const [cinNumber, setCinNumber] = useState(""); 
  const [profilePicture, setProfilePicture] = useState(null); 
  
  // Champs LOCATEUR
  const [agenceName, setAgenceName] = useState(""); 
  const [ownerAddress, setOwnerAddress] = useState(""); // Juste pour UI, non envoyé si pas dans DTO
  const [ownerProfilePicture, setOwnerProfilePicture] = useState(null);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Thème
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark"); else root.classList.remove("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Gestion fermeture dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) setClientDropdownOpen(false);
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target)) setOwnerDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSelectedCountry = (code) => countryCodes.find(item => item.code === code) || countryCodes[0];

  const handleFileUpload = (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  // Étape 1 : Validation de base
  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setStep(2);
  };

  // Étape 2 : Envoi vers Spring Boot
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fullPhone = `${countryCode} ${phoneNumber}`;

      // Construction du JSON correspondant au DTO Java "SignupRequest"
      const payload = {
        fullName: fullName,
        email: email,
        password: password,
        phone: fullPhone,
        role: identity, // "client" ou "owner"
        
        // Si c'est un client
        address: identity === "client" ? address : null,
        cin: identity === "client" ? cinNumber : null,
        profilePicture: identity === "client" ? profilePicture : ownerProfilePicture,

        // Si c'est un propriétaire
        agence: identity === "owner" ? agenceName : null
      };

      console.log("Envoi au backend:", payload);

      const response = await fetch("http://localhost:2000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Compte créé avec succès ! Connectez-vous.");
        if (onGoToSignIn) onGoToSignIn();
      } else {
        const message = await response.text();
        setError(message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur (Vérifiez que Spring Boot tourne sur le port 8080).");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDU JSX ---

  const renderStep1 = () => (
    <>
      <div className="signin-header">
        <h2 className="signin-title signup-title-purple">Créer un compte</h2>
        <p className="signin-subtitle">Commencez par vos informations de base.</p>
      </div>
      {error && <div className="signin-error">{error}</div>}
      
      <form className="signin-form" onSubmit={handleBasicInfoSubmit}>
        <div className="signin-field">
          <label className="signin-label">Nom Complet</label>
          <input className="signin-input" type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
        </div>
        <div className="signin-field">
          <label className="signin-label">Email</label>
          <input className="signin-input" type="email" placeholder="email@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="signin-field">
          <label className="signin-label">Mot de passe</label>
          <div className="signin-password-wrapper">
             <input className="signin-password-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
             <button type="button" className="signin-toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Cacher" : "Voir"}</button>
          </div>
        </div>
        <div className="signin-field">
          <label className="signin-label">Confirmer mot de passe</label>
          <input className="signin-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </div>

        <div className="signin-field">
           <span className="signin-label">Je suis :</span>
           <div className="identity-row">
             <label className={`identity-pill ${identity === "client" ? "identity-pill--active" : ""}`}>
               <input type="radio" name="identity" value="client" checked={identity === "client"} onChange={e => setIdentity(e.target.value)} />
               <FaCar className="identity-icon" /> Client
             </label>
             <label className={`identity-pill ${identity === "owner" ? "identity-pill--active" : ""}`}>
               <input type="radio" name="identity" value="owner" checked={identity === "owner"} onChange={e => setIdentity(e.target.value)} />
               <FaHandHoldingUsd className="identity-icon" /> Locateur
             </label>
           </div>
        </div>
        <button type="submit" className="signin-button">Suivant</button>
      </form>
      <div className="signin-footer">
        Déjà un compte ? <button type="button" className="signin-link" onClick={onGoToSignIn}>Connexion</button>
      </div>
    </>
  );

  const renderClientStep2 = () => (
    <>
      <div className="signin-header">
        <button type="button" className="back-button-inline" onClick={() => setStep(1)}><FaArrowLeft /> Retour</button>
        <h2 className="signin-title signup-title-purple">Info Client</h2>
      </div>
      {error && <div className="signin-error">{error}</div>}

      <form className="signin-form" onSubmit={handleFinalSubmit}>
        <div className="signin-field">
          <label className="signin-label">Téléphone *</label>
          <div className="phone-input-wrapper">
             <div className="country-code-dropdown" ref={clientDropdownRef}>
               <button type="button" className="country-code-select-button" onClick={() => setClientDropdownOpen(!clientDropdownOpen)}>
                 <span className="country-flag">{getSelectedCountry(countryCode).flag}</span>
                 <FaChevronDown className={`dropdown-arrow ${clientDropdownOpen ? 'open' : ''}`} />
               </button>
               {clientDropdownOpen && (
                 <div className="country-code-dropdown-menu">
                   {countryCodes.map((item) => (
                     <button key={item.code} type="button" className="country-code-option" onClick={() => { setCountryCode(item.code); setClientDropdownOpen(false); }}>
                       <span className="country-flag">{item.flag}</span> <span className="country-code-text">{item.code}</span>
                     </button>
                   ))}
                 </div>
               )}
             </div>
             <input className="signin-input phone-input" type="tel" placeholder="600000000" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
          </div>
        </div>

        <div className="signin-field">
          <label className="signin-label">Adresse *</label>
          <input className="signin-input" type="text" placeholder="Adresse complète" value={address} onChange={e => setAddress(e.target.value)} required />
        </div>

        <div className="signin-field">
          <label className="signin-label">Numéro CIN (CNE) *</label>
          <input className="signin-input" type="text" placeholder="Ex: AB123456" value={cinNumber} onChange={e => setCinNumber(e.target.value)} required />
        </div>

        <div className="signin-field">
          <label className="signin-label">Photo de profil</label>
          <div className="file-upload-wrapper">
             <input type="file" id="client-pic" style={{display:'none'}} onChange={e => handleFileUpload(e.target.files[0], setProfilePicture)} />
             <button type="button" className="file-upload-button" onClick={() => document.getElementById('client-pic').click()}>
                <FaUpload /> {profilePicture ? "Photo chargée" : "Choisir une photo"}
             </button>
          </div>
        </div>

        <button type="submit" className="signin-button" disabled={loading}>{loading ? "Création..." : "Terminer"}</button>
      </form>
    </>
  );

  const renderOwnerStep2 = () => (
    <>
      <div className="signin-header">
        <button type="button" className="back-button-inline" onClick={() => setStep(1)}><FaArrowLeft /> Retour</button>
        <h2 className="signin-title signup-title-purple">Info Locateur</h2>
      </div>
      {error && <div className="signin-error">{error}</div>}

      <form className="signin-form" onSubmit={handleFinalSubmit}>
        <div className="signin-field">
          <label className="signin-label">Téléphone *</label>
          <div className="phone-input-wrapper">
             <div className="country-code-dropdown" ref={ownerDropdownRef}>
               <button type="button" className="country-code-select-button" onClick={() => setOwnerDropdownOpen(!ownerDropdownOpen)}>
                 <span className="country-flag">{getSelectedCountry(countryCode).flag}</span>
                 <FaChevronDown className={`dropdown-arrow ${ownerDropdownOpen ? 'open' : ''}`} />
               </button>
               {ownerDropdownOpen && (
                 <div className="country-code-dropdown-menu">
                   {countryCodes.map((item) => (
                     <button key={item.code} type="button" className="country-code-option" onClick={() => { setCountryCode(item.code); setOwnerDropdownOpen(false); }}>
                       <span className="country-flag">{item.flag}</span> <span className="country-code-text">{item.code}</span>
                     </button>
                   ))}
                 </div>
               )}
             </div>
             <input className="signin-input phone-input" type="tel" placeholder="600000000" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
          </div>
        </div>

        <div className="signin-field">
          <label className="signin-label">Nom de l'Agence *</label>
          <input className="signin-input" type="text" placeholder="Ex: Location Auto Maroc" value={agenceName} onChange={e => setAgenceName(e.target.value)} required />
        </div>

        <div className="signin-field">
          <label className="signin-label">Logo / Photo</label>
          <div className="file-upload-wrapper">
             <input type="file" id="owner-pic" style={{display:'none'}} onChange={e => handleFileUpload(e.target.files[0], setOwnerProfilePicture)} />
             <button type="button" className="file-upload-button" onClick={() => document.getElementById('owner-pic').click()}>
                <FaUpload /> {ownerProfilePicture ? "Image chargée" : "Choisir une image"}
             </button>
          </div>
        </div>

        <button type="submit" className="signin-button" disabled={loading}>{loading ? "Création..." : "Terminer"}</button>
      </form>
    </>
  );

  return (
    <div className="signin-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', background: '#f5f3ff' }}>
      <button onClick={() => setIsDark(!isDark)} className="fixed top-4 right-4 p-2 rounded-lg">{isDark ? <Sun /> : <Moon />}</button>
      <div className="app-brand" style={{ marginBottom: '20px', color: '#4c1d95', fontWeight: 'bold', fontSize: '24px' }}>
        <img src={logo} alt="Logo" style={{ width: '40px', marginRight: '10px' }} />
        CAR<span style={{ color: '#7c3aed' }}>RENT</span>
      </div>
      <div className="signin-card" style={{ maxWidth: '420px', width: '100%', padding: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {step === 1 && renderStep1()}
        {step === 2 && identity === "client" && renderClientStep2()}
        {step === 2 && identity === "owner" && renderOwnerStep2()}
      </div>
    </div>
  );
}

export default SignUp;