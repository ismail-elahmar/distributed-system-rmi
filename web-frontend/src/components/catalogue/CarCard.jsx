// src/components/catalogue/CarCard.jsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, CheckCircle2, XCircle, Users, Fuel, Settings } from "lucide-react";

const CarCard = memo(function CarCard({ car, onClick }) {
  // 🔹 MAPPING DES DONNÉES (Adaptation JSON Backend -> UI)
  
  // 1. Disponibilité (votre API renvoie un booléen true/false)
  const isAvailable = car.disponibilite === true;

  // 2. Nom complet
  const carName = `${car.marque} ${car.modele}`;

  // 3. Propriétaire (Nom de l'agence ou Locateur par défaut)
  // Utilisation de agence_nom si disponible, sinon Locateur + ID
  const ownerName = car.agence_nom || `Locateur #${car.locateur_id}`;

  // 4. Extraction de la ville depuis l'adresse (ou valeur par défaut)
  // Si agence_adresse est "12 Av. des FAR, Meknès", on essaie de prendre "Meknès"
  const city = car.agence_adresse 
    ? car.agence_adresse.split(',').pop().trim() // Prend la dernière partie après la virgule
    : "Maroc"; 

  // Valeurs par défaut pour les champs non présents dans votre table Voiture
  const seats = "5"; // Par défaut
  const transmission = "Manuelle"; // Par défaut

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-gray-200/30 dark:border-purple-800/20 flex flex-col h-full cursor-pointer"
      onClick={() => onClick?.(car)}
    >
      {/* Owner at the top */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {ownerName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600 dark:text-white font-medium truncate transition-colors duration-300" title={ownerName}>
            {ownerName}
          </span>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Overlay on hover with "View details" */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none flex items-end justify-center pb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-indigo-950/90 backdrop-blur-sm rounded-full shadow-lg transition-colors duration-300">
            <span className="text-sm font-semibold text-indigo-600">Voir détails</span>
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* 🔹 Utilisation de car.image_url */}
        {car.image_url ? (
          <img
            src={car.image_url}
            alt={carName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            decoding="async"
            // Ajout d'une image par défaut si le lien est cassé
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl"></div>
              <p className="text-sm text-gray-500">Pas d'image</p>
            </div>
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-20">
          {isAvailable ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              <CheckCircle2 className="w-3 h-3" />
              Dispo
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              <XCircle className="w-3 h-3" />
              Réservé
            </span>
          )}
        </div>

        {/* Distance Badge (affiché seulement si calculé dans Catalogue.jsx) */}
        {car.__distanceKm !== undefined && (
          <div className="absolute top-3 left-3 z-20">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              <Navigation className="w-3 h-3" />
              {car.__distanceKm.toFixed(1)} km
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Top row: Car name on left, Location on right */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 transition-colors duration-300">
            {carName}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-white transition-colors duration-300">
            <MapPin className="w-4 h-4 text-indigo-500 dark:text-white" />
            <span className="truncate max-w-[100px]" title={car.agence_adresse}>{city}</span>
          </div>
        </div>

        {/* Three spec cards horizontally aligned */}
        <div className="flex gap-1.5 mb-3">
          {/* Seats card */}
          <div className="flex-1 bg-purple-50/80 dark:bg-indigo-900/60 backdrop-blur-sm rounded-2xl p-2 border border-purple-200/50 dark:border-purple-700/30 flex items-center justify-center gap-1.5 transition-colors duration-300">
            <Users className="w-3 h-3 text-purple-600 dark:text-white flex-shrink-0" />
            <span className="text-[10px] text-gray-700 dark:text-white leading-tight transition-colors duration-300">
                {seats} pl.
            </span>
          </div>
          
          {/* Fuel card (Utilisation de car.carburant) */}
          <div className="flex-1 bg-purple-50/80 dark:bg-indigo-900/60 backdrop-blur-sm rounded-2xl p-2 border border-purple-200/50 dark:border-purple-700/30 flex items-center justify-center gap-1.5 transition-colors duration-300">
            <Fuel className="w-3 h-3 text-purple-600 dark:text-white flex-shrink-0" />
            <span className="text-[10px] text-gray-700 dark:text-white leading-tight transition-colors duration-300 truncate">
                {car.carburant || "N/A"}
            </span>
          </div>
          
          {/* Transmission card */}
          <div className="flex-1 bg-purple-50/80 dark:bg-indigo-900/60 backdrop-blur-sm rounded-2xl p-2 border border-purple-200/50 dark:border-purple-700/30 flex items-center justify-center gap-1.5 transition-colors duration-300">
            <Settings className="w-3 h-3 text-purple-600 dark:text-white flex-shrink-0" />
            <span className="text-[10px] text-gray-700 dark:text-white leading-tight transition-colors duration-300">
                {transmission}
            </span>
          </div>
        </div>

        {/* Price (Utilisation de car.prix_par_jour) */}
        <div className="text-gray-900 dark:text-white transition-colors duration-300">
          <p className="text-lg font-semibold">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-purple-200 dark:to-purple-300 bg-clip-text text-transparent align-middle">
              {car.prix_par_jour}
            </span>
            <span className="ml-1 text-sm font-medium align-middle text-gray-600 dark:text-white transition-colors duration-300">MAD</span>
            <span className="ml-2 text-sm font-medium align-middle text-gray-500 dark:text-white transition-colors duration-300">/ jour</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default CarCard;