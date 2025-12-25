import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, CreditCard, 
  CheckCircle2, User, Mail, Shield,
  ChevronRight, Lock, Receipt,
  Navigation, Wifi, Baby, Package,
  Wallet, Smartphone, Home, Tag, ChevronDown
} from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";
import toast from "react-hot-toast";

// --- COMPOSANT RÉSUMÉ (Adapté aux données API) ---
const ReservationSummary = ({ car, formData, days, totalPrice, step }) => {
  const insuranceCost = { basic: 50, premium: 100, full: 200 }[formData.insurance] || 0;
  const extrasCost = { gps: 25, wifi: 40, babySeat: 30, delivery: 150 };
  const extrasTotal = formData.extras.reduce((sum, extra) => sum + (extrasCost[extra] || 0), 0);
  
  // Adaptation : Utilisation des champs API (prix_par_jour, marque, modele)
  const subTotal = days * (car.prix_par_jour || 0);

  const extrasOptions = {
    gps: { label: "Premium GPS", price: 25 },
    wifi: { label: "Mobile WiFi", price: 40 },
    babySeat: { label: "Child Seat", price: 30 },
    delivery: { label: "Delivery", price: 150 }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-indigo-950/40 rounded-2xl shadow-sm border border-gray-200 dark:border-purple-800/30 overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-purple-800/30">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Récapitulatif</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Étape {step} sur 3</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Véhicule */}
          <div className="flex items-center gap-4">
             <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              <img 
                src={car.image_url} 
                alt={car.modele} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-gray-900 dark:text-white truncate">{car.marque} {car.modele}</h3>
              <div className="flex items-center gap-2 mt-1">
                 <Tag className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                 <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{car.agence_nom}</p>
              </div>
            </div>
          </div>
          
          {/* Détails Prix */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                   <p className="text-sm font-medium text-gray-900 dark:text-white">{car.prix_par_jour} MAD/jour</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400">{days || 0} jour{days > 1 ? 's' : ''}</p>
                </div>
              </div>
              
              {formData.insurance && insuranceCost > 0 && (
                <div className="flex justify-between items-center">
                  <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Assurance</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{formData.insurance}</p>
                  </div>
                    <p className="font-semibold text-indigo-600 dark:text-purple-400">+{insuranceCost} MAD</p>
                </div>
              )}
              
              {formData.extras.length > 0 && (
                 <div className="border-t border-gray-100 dark:border-purple-800/30 pt-3">
                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Options</p>
                  {formData.extras.map(extraId => {
                    const extra = extrasOptions[extraId];
                    if (!extra) return null;
                    return (
                      <div key={extraId} className="flex justify-between items-center text-sm mb-2">
                         <span className="text-gray-700 dark:text-gray-300">{extra.label}</span>
                         <span className="font-medium text-indigo-600 dark:text-purple-400">+{extra.price} MAD</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Total */}
             <div className="border-t border-gray-200 dark:border-purple-800/30 pt-4">
              <div className="flex justify-between items-center">
                <div>
                   <p className="font-bold text-gray-900 dark:text-white">Total</p>
                </div>
                <motion.div
                  key={totalPrice}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                   className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {totalPrice} MAD
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT INDICATEUR D'ÉTAPE (Inchangé) ---
const StepIndicator = ({ steps, currentStep, onStepClick, isSubmitting }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          return (
            <div key={step.number} className="flex items-center">
              <motion.button
                onClick={() => !isSubmitting && onStepClick(step.number)}
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full transition-colors ${
                  isActive
                    ? "bg-purple-800/30 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] border border-purple-500/50"
                    : isCompleted
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-purple-800 dark:text-gray-300 hover:text-purple-900 dark:hover:text-white"
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : isCompleted
                      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600/40"
                      : "bg-purple-800/20 dark:bg-gray-800 text-purple-800 dark:text-gray-300 border border-purple-800/30 dark:border-gray-700"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[10px] sm:text-xs font-semibold">Étape {step.number}</span>
                  <span className="text-xs sm:text-sm font-semibold">{step.title}</span>
                </div>
              </motion.button>
              {index < steps.length - 1 && <div className="w-4 sm:w-6 md:w-12 lg:w-16 h-px bg-purple-900/50 mx-1 sm:mx-2 md:mx-3 lg:mx-4"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- COMPOSANT CONTENU DES ÉTAPES ---
const StepContent = ({ step, formData, onFormChange, onToggleExtra, days, subTotal }) => {
  const extrasOptions = [
    { id: "gps", label: "Premium GPS", price: 25, icon: Navigation },
    { id: "wifi", label: "Mobile WiFi", price: 40, icon: Wifi },
    { id: "babySeat", label: "Siège Enfant", price: 30, icon: Baby },
    { id: "delivery", label: "Livraison à domicile", price: 150, icon: Home }
  ];

  const insuranceOptions = [
    { id: "basic", label: "Basique", price: 50, desc: "Protection responsabilité civile" },
    { id: "premium", label: "Premium", price: 100, desc: "Collision + Vol + Assistance" },
    { id: "full", label: "Complète", price: 200, desc: "Couverture totale sans franchise" }
  ];

  switch (step) {
    case 1:
      return (
        <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-indigo-950/40 rounded-2xl border border-gray-200 dark:border-purple-800/30 p-6 transition-colors duration-300">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dates de location</h2>
            <p className="text-gray-600 dark:text-gray-300">Choisissez la période souhaitée</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-600 dark:text-gray-400" /><span>Date de début</span></label>
              <input type="date" name="startDate" value={formData.startDate} onChange={onFormChange} min={new Date().toISOString().split('T')[0]} required className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-purple-600 dark:text-gray-400" /><span>Date de fin</span></label>
              <input type="date" name="endDate" value={formData.endDate} onChange={onFormChange} min={formData.startDate || new Date().toISOString().split('T')[0]} required className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors" />
            </div>
          </div>
          {days > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-5 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/60 dark:border-emerald-800/50 transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100/80 dark:bg-emerald-900/40 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /></div>
                  <div>
                    <p className="font-semibold text-emerald-700 dark:text-emerald-300">{days} jour{days !== 1 ? 's' : ''} sélectionné(s)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{subTotal} MAD</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      );

    case 2:
      return (
        <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-indigo-950/40 rounded-2xl border border-gray-200 dark:border-purple-800/30 p-6 transition-colors duration-300">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Options & Assurance</h2>
          </div>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6"><Shield className="w-5 h-5 text-indigo-600 dark:text-purple-400" /><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Protection</h3></div>
            <div className="space-y-4">
              {insuranceOptions.map((option) => {
                const isSelected = formData.insurance === option.id;
                return (
                  <label key={option.id} className={`block p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-indigo-500 dark:border-purple-500 bg-indigo-50 dark:bg-purple-900/30' : 'border-gray-300 dark:border-purple-800/50'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'}`}>{isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1"><span className="font-semibold text-gray-900 dark:text-white">{option.label}</span><span className="text-lg font-bold text-indigo-600 dark:text-purple-400">+{option.price} MAD</span></div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{option.desc}</p>
                        </div>
                      </div>
                      <input type="radio" name="insurance" value={option.id} checked={isSelected} onChange={onFormChange} className="sr-only" />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6"><Package className="w-5 h-5 text-purple-600 dark:text-purple-400" /><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Services Additionnels</h3></div>
            <div className="grid md:grid-cols-2 gap-4">
              {extrasOptions.map((extra) => {
                const Icon = extra.icon;
                const isSelected = formData.extras.includes(extra.id);
                return (
                  <label key={extra.id} className={`relative p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-300 dark:border-purple-800/50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600' : 'bg-gray-100 text-gray-600'}`}><Icon className="w-4 h-4" /></div>
                        <div><p className="font-medium text-gray-900 dark:text-white">{extra.label}</p><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+{extra.price} MAD</p></div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-400'}`}>{isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}</div>
                    </div>
                    <input type="checkbox" checked={isSelected} onChange={() => onToggleExtra(extra.id)} className="sr-only" />
                  </label>
                );
              })}
            </div>
          </div>
        </motion.div>
      );

    case 3:
      return (
        <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-indigo-950/40 rounded-2xl border border-gray-200 dark:border-purple-800/30 p-6 transition-colors duration-300">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Informations & Paiement</h2>
            <p className="text-gray-600 dark:text-gray-300">Confirmez vos coordonnées</p>
          </div>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prénom</label>
                <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" name="firstName" value={formData.firstName} onChange={onFormChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none" placeholder="Prénom" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={onFormChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none" placeholder="Nom" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Mail className="w-4 h-4" /><span>Email</span></label>
              <input type="email" name="email" value={formData.email} onChange={onFormChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Smartphone className="w-4 h-4" /><span>Téléphone</span></label>
              <PhoneInput defaultCountry="ma" value={formData.phone} onChange={(phone) => onFormChange({ target: { name: "phone", value: phone } })} inputClassName="!w-full !h-12 !bg-transparent !text-gray-900 dark:!text-white !border-0" containerClassName="border border-gray-300 dark:border-purple-800/50 rounded-lg bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Wallet className="w-4 h-4" /><span>Méthode de paiement</span></label>
              <div className="relative">
                <select name="paymentMethod" value={formData.paymentMethod} onChange={onFormChange} className="w-full appearance-none pr-12 pl-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none">
                  <option value="card">Carte Bancaire</option>
                  <option value="cash">Espèces à l'agence</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            {formData.paymentMethod === "card" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4" /><span>Numéro de carte</span></label>
                  <input type="text" name="cardNumber" value={formData.cardNumber || ""} onChange={onFormChange} maxLength={19} placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiration</label>
                    <input type="text" name="cardExpiry" value={formData.cardExpiry || ""} onChange={onFormChange} maxLength={5} placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Lock className="w-4 h-4" /><span>CVV</span></label>
                    <input type="text" name="cardCVV" value={formData.cardCVV || ""} onChange={onFormChange} maxLength={4} placeholder="123" className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none" required />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    default: return null;
  }
};

// --- PAGE PRINCIPALE ---
export default function ReservationPage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    insurance: "", 
    extras: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // 1. Charger les infos de la voiture depuis Spring Boot
  useEffect(() => {
    fetch(`http://localhost:2000/api/voitures/${carId}`)
      .then(res => {
        if (!res.ok) throw new Error("Voiture introuvable");
        return res.json();
      })
      .then(data => {
        setCar(data);
      })
      .catch(() => {
        toast.error("Impossible de charger le véhicule");
        navigate("/catalogue");
      });

    // 2. Pré-remplir avec l'utilisateur connecté
    const currentUserJson = localStorage.getItem("carrent_current_user");
    if (currentUserJson) {
      const user = JSON.parse(currentUserJson);
      // On divise "fullName" en prénom/nom de manière basique
      const names = user.name ? user.name.split(" ") : ["", ""];
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [carId, navigate]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Validation des étapes intermédiaires
    if (step < 3) {
      if (step === 1 && (!formData.startDate || !formData.endDate)) {
        toast.error("Veuillez sélectionner les dates");
        return;
      }
      if (step === 2 && !formData.insurance) {
        toast.error("Veuillez choisir une assurance");
        return;
      }
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Validation finale
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Veuillez remplir toutes les informations de contact");
      return;
    }

    // --- ENVOI AU BACKEND SPRING BOOT ---
    setIsSubmitting(true);

    try {
        const currentUser = JSON.parse(localStorage.getItem("carrent_current_user"));
        
        if (!currentUser) {
            toast.error("Session expirée. Veuillez vous reconnecter.");
            navigate("/signin");
            return;
        }

        // Construction du Payload conforme à ReservationRequest.java
        const payload = {
            clientId: currentUser.id,
            voitureId: car.voiture_id,
            startDate: formData.startDate,
            endDate: formData.endDate,
            insurance: formData.insurance,
            extras: formData.extras,
            paymentMethod: formData.paymentMethod
        };

        const response = await fetch("http://localhost:2000/api/reservations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            toast.success(
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="font-semibold">Réservation confirmée !</p>
                  <p className="text-sm opacity-90">Un email de confirmation a été envoyé.</p>
                </div>
              </div>,
              { duration: 4000 }
            );
            setTimeout(() => {
                navigate("/bookings"); // Assurez-vous d'avoir une page pour lister les réservations
            }, 1500);
        } else {
            const errorText = await response.text();
            toast.error(errorText || "Erreur lors de la réservation");
        }

    } catch (err) {
        console.error("Erreur:", err);
        toast.error("Impossible de contacter le serveur");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === "cardNumber") formattedValue = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
    if (name === "cardExpiry") formattedValue = value.replace(/\D/g, "").replace(/^(\d{2})(\d{0,2})/, "$1/$2").substr(0, 5);
    if (name === "cardCVV") formattedValue = value.replace(/\D/g, "");
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const toggleExtra = (extra) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.includes(extra) ? prev.extras.filter(e => e !== extra) : [...prev.extras, extra]
    }));
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(-1);
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber < step) {
      setStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1a0f24]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  // Calculs pour l'affichage temps réel
  const days = formData.startDate && formData.endDate
    ? Math.max(1, Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)))
    : 0;
  
  const insuranceCost = { basic: 50, premium: 100, full: 200 }[formData.insurance] || 0;
  const extrasCost = { gps: 25, wifi: 40, babySeat: 30, delivery: 150 };
  const extrasTotal = formData.extras.reduce((sum, extra) => sum + (extrasCost[extra] || 0), 0);
  const subTotal = days * (car.prix_par_jour || 0);
  const totalPrice = subTotal + insuranceCost + extrasTotal;

  const steps = [
    { number: 1, title: "Dates", icon: Calendar },
    { number: 2, title: "Options", icon: Package },
    { number: 3, title: "Paiement", icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a0f24] transition-colors duration-300 pt-20">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-white dark:bg-indigo-950/40 border-b border-gray-200 dark:border-purple-800/30 shadow-sm backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <StepIndicator steps={steps} currentStep={step} onStepClick={handleStepClick} isSubmitting={isSubmitting} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Colonne Principale (Formulaire) */}
           <div className="md:col-span-2 space-y-8">
            <form onSubmit={handleSubmit}>
              <StepContent 
                step={step}
                formData={formData}
                onFormChange={handleFormChange}
                onToggleExtra={toggleExtra}
                days={days}
                subTotal={subTotal}
              />
            </form>

            {/* Boutons Actions */}
            <div className="bg-white dark:bg-indigo-950/40 rounded-2xl border border-gray-200 dark:border-purple-800/30 p-6 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row gap-3">
                {step > 1 && (
                  <motion.button type="button" onClick={prevStep} disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="px-6 py-3 border border-gray-300 dark:border-purple-800/50 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50">
                    Précédent
                  </motion.button>
                )}
                <motion.button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || (step === 1 && (!formData.startDate || !formData.endDate)) || (step === 2 && !formData.insurance)}
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}} 
                  whileTap={!isSubmitting ? { scale: 0.99 } : {}} 
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-indigo-500 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:opacity-50`}
                >
                  {isSubmitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Traitement...</> : step < 3 ? <>Continuer <ChevronRight className="w-4 h-4" /></> : <><Lock className="w-4 h-4" /> Payer & Réserver</>}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Colonne Latérale (Résumé) */}
          <div className="md:col-span-1">
            <ReservationSummary car={car} formData={formData} days={days} totalPrice={totalPrice} step={step} />
          </div>
        </div>
      </div>
    </div>
  );
}