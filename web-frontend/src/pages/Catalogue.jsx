// src/pages/Catalogue.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  lazy,
  Suspense,
  useCallback
} from "react";

import { motion, AnimatePresence } from "framer-motion";
import CarCard from "../components/catalogue/CarCard";
import FiltersBar from "../components/catalogue/FiltersBar";
import { distanceInKm } from "../utils/geo";
import { Search } from "lucide-react";

// Lazy load modal
const DetailsModal = lazy(() =>
  import("../components/catalogue/DetailsModal")
);

export default function Catalogue() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // État des filtres
  const [filter, setFilter] = useState({
    availability: "all", // "all" | "available" | "unavailable"
    location: "all",
    brand: "",
    userCoords: null,
    radiusKm: 50
  });

  const [selectedCar, setSelectedCar] = useState(null);

  // 🔹 Fetch cars from Spring Boot
  useEffect(() => {
    fetch("http://localhost:2000/api/voitures/disponibles")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch cars");
        }
        return res.json();
      })
      .then((data) => {
        setCars(data);
        setLoading(false);
        console.log("données voitures chargées:", data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleFilter = useCallback((filterObj) => {
    setFilter((prev) => ({
      ...prev,
      ...filterObj
    }));
  }, []);

  // 🔹 Logic de Filtrage Adaptée au JSON
  const filtered = useMemo(() => {
    let list = cars.slice();

    // 1. Filtrer par disponibilité (Boolean vs String)
    if (filter.availability !== "all") {
      const isRequestedAvailable = filter.availability === "available"; 
      // Compare le booléen de l'API (c.disponibilite) avec le choix du filtre
      list = list.filter(
        (c) => c.disponibilite === isRequestedAvailable
      );
    }

    // 2. Filtrer par Marque (c.marque)
    if (filter.brand) {
      // Normalisation pour éviter les erreurs de casse (Land Rover vs land rover)
      list = list.filter((c) => 
        c.marque.toLowerCase() === filter.brand.toLowerCase()
      );
    }

    // 3. Filtrer par Localisation
    // NOTE: Votre JSON ne montre pas de champs 'latitude', 'longitude' ou 'city'.
    // Ce code suppose qu'ils existent peut-être dans d'autres objets ou gère leur absence.
    if (filter.location !== "all") {
      if (filter.location === "nearest" && filter.userCoords) {
        list = list
          .map((c) => {
            // Protection si lat/lng manquent dans le JSON
            const lat = c.latitude || 0; 
            const lng = c.longitude || 0;
            return {
              ...c,
              __distanceKm: distanceInKm(
                filter.userCoords.lat,
                filter.userCoords.lng,
                lat,
                lng
              )
            };
          })
          .filter(
            (c) => c.__distanceKm <= (filter.radiusKm ?? 50)
          )
          .sort((a, b) => a.__distanceKm - b.__distanceKm);
      } else {
        // Filtrage par ville (si le champ existe)
        list = list.filter(
          (c) => c.ville && c.ville.toLowerCase() === filter.location.toLowerCase()
        );
      }
    }

    return list;
  }, [cars, filter]);

  const openDetails = useCallback((car) => {
    setSelectedCar(car);
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedCar(null);
  }, []);

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Chargement des véhicules...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-[#1a0f24] transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Assurez-vous que FiltersBar utilise bien les marques uniques issues de 'marque' */}
        <FiltersBar cars={cars} onFilter={handleFilter} />

        <div className="mb-6 flex items-center gap-4">
          <Search className="w-5 h-5" />
          <span>{filtered.length} véhicule(s) trouvé(s)</span>
        </div>

        {filtered.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filtered.map((car) => (
                <motion.div
                  // UTILISATION DE L'ID DU JSON (voiture_id)
                  key={car.voiture_id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {/* Passez l'objet car complet. Vous devrez peut-être adapter CarCard aussi */}
                  <CarCard car={car} onClick={openDetails} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) 
        : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold">
              Aucun véhicule trouvé
            </h3>
          </div>
        )}

        <AnimatePresence>
          {selectedCar && (
            <Suspense fallback={null}>
              <DetailsModal
                car={selectedCar}
                onClose={closeDetails}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}