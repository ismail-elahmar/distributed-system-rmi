// src/components/catalogue/DetailsModal.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MapPin, Calendar, CheckCircle2, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Building, Users, Fuel, Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function DetailsModal({ car, onClose }) {
  const navigate = useNavigate();
  
  // États pour l'interface (Zoom, Slide, Touch)
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef(null);
  const zoomContainerRef = useRef(null);

  // ---------------------------------------------------------
  // 🔹 MAPPING DES DONNÉES (DB SQL -> Frontend)
  // ---------------------------------------------------------

  if (!car) return null;

  // 1. Disponibilité
  const isAvailable = car.disponibilite === true;

  // 2. Images : API renvoie 'image_url' (String). On le met dans un tableau pour le slider.
  const images = car.image_url ? [car.image_url] : [];
  const activeImage = images[activeIndex];

  // 3. Nom de la voiture
  const carName = `${car.marque} ${car.modele}`;

  // 4. Propriétaire (Agence)
  const ownerName = car.agence_nom || `Locateur #${car.locateur_id}`;

  // 5. Ville (Extraction depuis l'adresse)
  const city = car.agence_adresse 
    ? car.agence_adresse.split(',').pop().trim() 
    : "Maroc";

  // 6. Infos techniques (Valeurs par défaut si absentes de la DB)
  const seats = "5"; 
  const transmission = "Manuelle";
  const fuelType = car.carburant || "Non spécifié";
  
  // 7. Description générée dynamiquement
  const description = `Louez ce véhicule ${car.marque} ${car.modele} en parfait état. ` +
    `Disponible immédiatement à ${city} chez ${ownerName}. ` +
    `Idéal pour vos déplacements professionnels ou personnels. ` +
    `Contactez l'agence au ${car.agence_phone || 'numéro indiqué'} pour plus d'infos.`;

  // ---------------------------------------------------------
  // 🔹 LOGIQUE FONCTIONNELLE
  // ---------------------------------------------------------

  const handleReserve = () => {
    if (!isAvailable) {
        toast.error("Ce véhicule n'est pas disponible actuellement.");
        return;
    }

    // Vérification Authentification
    const currentUser = localStorage.getItem("carrent_current_user");

    if (currentUser) {
        // Utilisateur connecté -> On réserve
        onClose();
        navigate(`/reservation/${car.voiture_id}`); // Utilisation de voiture_id
        toast.success("Redirection vers la réservation...");
    } else {
        // Utilisateur NON connecté -> On redirige vers le Login
        onClose();
        // On sauvegarde la destination pour rediriger après le login
        sessionStorage.setItem("redirectAfterLogin", `/reservation/${car.voiture_id}`);
        navigate("/signin");
        toast("Connectez-vous pour réserver ce véhicule", { icon: '🔒' });
    }
  };

  // --- Gestion du Slider ---
  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  }, [images.length]);

  const resetZoom = () => {
    setIsZoomed(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // --- Gestion du Touch (Swipe mobile) ---
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextImage();
    if (distance < -50) prevImage();
    setTouchStart(null);
    setTouchEnd(null);
  };

  // --- Gestion du Zoom ---
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5));
    setIsZoomed(true);
  };
  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) resetZoom();
      return newZoom;
    });
  };
  const handleImageClick = () => {
    if (!isZoomed) {
      setIsZoomed(true);
      setZoomLevel(2);
    }
  };

  // --- Gestion du Drag (Image zoomée) ---
  const handleMouseDown = (e) => {
    if (isZoomed && zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  useEffect(() => {
    if (isZoomed) {
      const mouseMoveHandler = (e) => {
        if (isDragging && isZoomed) {
          setImagePosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
          });
        }
      };
      const mouseUpHandler = () => setIsDragging(false);
      
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      return () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
    }
  }, [isZoomed, isDragging, dragStart]);

  // --- Clavier (Echap / Flèches) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && images.length > 1) prevImage();
      else if (e.key === "ArrowRight" && images.length > 1) nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, prevImage, nextImage, images.length]);


  // ---------------------------------------------------------
  // 🔹 RENDU JSX
  // ---------------------------------------------------------
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 dark:bg-black/90 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white dark:bg-indigo-950/90 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col transition-colors duration-300"
          role="dialog"
          aria-modal="true"
        >
          {/* Bouton Fermer */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-indigo-900 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-white" />
            </motion.button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            
            {/* --- GAUCHE : IMAGES --- */}
            <div className="md:w-3/5 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 flex flex-col transition-colors duration-300 p-3 md:p-4">
              <div className="flex-1 relative overflow-hidden rounded-lg mb-2" style={{ minHeight: '300px' }}>
                <div 
                  ref={imageRef}
                  className="relative w-full h-full"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    {activeImage ? (
                      <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex items-center justify-center p-4 cursor-zoom-in"
                        ref={zoomContainerRef}
                        onClick={handleImageClick}
                        onMouseDown={handleMouseDown}
                        style={{ overflow: isZoomed ? 'hidden' : 'visible' }}
                      >
                        <motion.img
                          src={activeImage}
                          alt={`${carName}`}
                          className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                          style={{
                            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel})`,
                            transformOrigin: 'center center',
                            cursor: isZoomed ? 'move' : 'zoom-in'
                          }}
                        />
                      </motion.div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Building className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                          <p>Pas d'image</p>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Zoom Controls */}
                  {isZoomed && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 p-2 bg-black/70 backdrop-blur-sm rounded-lg z-20">
                      <button onClick={(e) => {e.stopPropagation(); handleZoomIn()}} className="p-2 text-white"><ZoomIn className="w-4 h-4"/></button>
                      <button onClick={(e) => {e.stopPropagation(); handleZoomOut()}} className="p-2 text-white"><ZoomOut className="w-4 h-4"/></button>
                      <button onClick={(e) => {e.stopPropagation(); resetZoom()}} className="p-2 text-white text-xs">Reset</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton d'action (Sticky Bottom sur mobile) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReserve}
                disabled={!isAvailable}
                className={`w-full py-3 px-4 sm:py-4 sm:px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-150 flex items-center justify-center gap-2 ${
                  isAvailable
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>{isAvailable ? "Réserver maintenant" : "Indisponible"}</span>
              </motion.button>
            </div>

            {/* --- DROITE : DÉTAILS --- */}
            <div className="md:w-2/5 p-4 md:p-6 lg:p-8 overflow-y-auto flex flex-col bg-white dark:bg-indigo-950/40 transition-colors duration-300">
              <div className="space-y-5">
                {/* Prix */}
                <div className="border-b pb-4 border-gray-200 dark:border-purple-800/30">
                    <p className="text-2xl font-semibold">
                      <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-purple-200 dark:to-purple-300 bg-clip-text text-transparent">
                        {car.prix_par_jour ? car.prix_par_jour : "—"}
                      </span>
                      <span className="ml-2 text-lg text-gray-600 dark:text-white">MAD / jour</span>
                    </p>
                </div>
                
                {/* Agence / Propriétaire */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {ownerName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {ownerName}
                  </p>
                </div>
                
                <div className="h-px bg-gray-200 dark:bg-purple-800/30"></div>
                
                {/* Titre */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {carName}
                </h2>

                {/* Caractéristiques */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                      <span>Ville: <span className="font-medium">{city}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Building className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                      <span>Marque: <span className="font-medium">{car.marque}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Users className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                      <span>Places: <span className="font-medium">{seats}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Settings className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                      <span>Boîte: <span className="font-medium">{transmission}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Fuel className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                      <span>Carburant: <span className="font-medium">{fuelType}</span></span>
                    </div>
                </div>

                {/* Description */}
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-purple-400 mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}