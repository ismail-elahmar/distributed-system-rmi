// src/components/catalogue/FiltersBar.jsx
import React, { useState, useEffect, memo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Filter, X, RotateCcw, Check, Car, Calendar, Map, ChevronDown, Search, Users, Settings, Fuel, DollarSign, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

const FiltersBar = memo(function FiltersBar({ cars, onFilter }) {
  // Filter state
  const [filters, setFilters] = useState({
    availability: "all", // "all", "available"
    location: "all", // "all" or city name
    brand: "", // selected brand or empty
    seats: "", // number of seats
    type: "", // "Manuelle", "Automatique"
    fuel: "", // "Diesel", "Essence", "Hybride", "Electrique"
    priceMin: "", 
    priceMax: "", 
    priceSort: "", // "low-to-high", "high-to-low"
    timesRented: "",
    dateFrom: "", 
    dateTo: "" 
  });
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  
  // Dropdown states
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityDropdownPosition, setCityDropdownPosition] = useState({ top: 0, left: 0 });
  
  const brandDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const cityDropdownDesktopRef = useRef(null);
  const cityButtonRef = useRef(null);
  const priceDropdownRef = useRef(null);
  const datePickerRef = useRef(null);

  // 🔹 Extraction des données uniques (Adapté au JSON : marque, ville)
  const brands = Array.from(new Set(cars.map(c => c.marque).filter(Boolean))).sort();
  const cities = Array.from(new Set(cars.map(c => c.ville).filter(Boolean))).sort();

  // Filtered lists for search
  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update dropdown position on scroll/resize
  useEffect(() => {
    if (showCityDropdown && cityButtonRef.current) {
      const updatePosition = () => {
        if (cityButtonRef.current) {
          const rect = cityButtonRef.current.getBoundingClientRect();
          setCityDropdownPosition({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX
          });
        }
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [showCityDropdown]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setShowBrandDropdown(false);
      }
      if ((!cityDropdownRef.current || !cityDropdownRef.current.contains(event.target)) &&
          (!cityDropdownDesktopRef.current || !cityDropdownDesktopRef.current.contains(event.target)) &&
          (!cityButtonRef.current || !cityButtonRef.current.contains(event.target))) {
        setShowCityDropdown(false);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
        setShowPriceDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize with no filters
  useEffect(() => {
    if (!appliedFilters) {
      onFilter({ 
        availability: "all", 
        location: "all", 
        brand: "",
        seats: "",
        type: "",
        fuel: "",
        priceMin: "",
        priceMax: "",
        priceSort: "",
        timesRented: "",
        dateFrom: "",
        dateTo: ""
      });
    }
  }, [appliedFilters, onFilter]);

  // Handle location selection
  const handleLocationSelect = useCallback((value) => {
    setFilters(prev => ({ ...prev, location: value }));
    setShowCityDropdown(false);
  }, []);

  // Handle brand selection
  const handleBrandSelect = useCallback((value) => {
    setFilters(prev => ({ ...prev, brand: value }));
    setShowBrandDropdown(false);
    setSearchQuery("");
  }, []);

  // Apply filters
  const applyFilters = useCallback((e) => {
    if (e) e.preventDefault();
    
    setAppliedFilters({ ...filters });
    
    const filterPayload = {
      ...filters
    };
    
    onFilter(filterPayload);
    setShowFilters(false);
    toast.success("Filtres appliqués !");
  }, [filters, onFilter]);

  // Reset all filters
  const resetFilters = useCallback((e) => {
    if (e) e.preventDefault();
    
    const resetState = {
      availability: "all",
      location: "all",
      brand: "",
      seats: "",
      type: "",
      fuel: "",
      priceMin: "",
      priceMax: "",
      priceSort: "",
      timesRented: "",
      rating: "",
      dateFrom: "",
      dateTo: ""
    };

    setFilters(resetState);
    setAppliedFilters(null);
    setSearchQuery("");
    setShowBrandDropdown(false);
    setShowCityDropdown(false);
    setShowPriceDropdown(false);
    setShowDatePicker(false);
    onFilter(resetState); // Directly apply reset
    toast.success("Filtres réinitialisés");
  }, [onFilter]);

  // Toggle filters panel
  const toggleFilters = useCallback((e) => {
    if (e) e.preventDefault();
    setShowFilters(!showFilters);
    setShowBrandDropdown(false);
    setShowCityDropdown(false);
    setShowPriceDropdown(false);
    setShowDatePicker(false);
  }, [showFilters]);

  // Check if filters have changed
  const hasUnsavedChanges = appliedFilters ? 
    JSON.stringify(filters) !== JSON.stringify(appliedFilters) : 
    Object.values(filters).some(val => val !== "" && val !== "all");

  // Check if any filter is active
  const hasActiveFilters = appliedFilters ? 
    Object.entries(appliedFilters).some(([key, val]) => {
      if (key === 'location' || key === 'availability') return val !== 'all';
      return val !== "";
    }) : false;

  // Display text helpers
  const getLocationText = () => filters.location === "all" ? "Toutes villes" : filters.location;
  const getPriceText = () => {
    if (filters.priceSort === "low-to-high") return "Prix croissant";
    if (filters.priceSort === "high-to-low") return "Prix décroissant";
    if (filters.priceSort === "range") {
      if (filters.priceMin || filters.priceMax) return `${filters.priceMin || 0} - ${filters.priceMax || "∞"}`;
      return "Plage de prix";
    }
    return "Prix";
  };
  const getDateText = () => {
    if (filters.dateFrom || filters.dateTo) return "Dates sélectionnées";
    return "Dates";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="bg-white dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg mb-6 border border-gray-200 dark:border-purple-800/30 transition-colors duration-300 overflow-visible"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header - Compact */}
      <div className="p-4 overflow-visible relative">
        <div className="flex items-center justify-between flex-wrap gap-3 overflow-visible relative">
          {/* Filters icon and text - Left */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600 dark:text-white" />
            <h3 className="font-semibold text-purple-600 dark:text-white">Filtres</h3>
          </div>
          
          {/* Quick filter chips - Center */}
          <div className="flex flex-wrap items-center gap-2 flex-1 justify-center">
            
            {/* DATE PICKER CHIP */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-white hidden sm:inline">Date:</span>
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors text-xs flex items-center gap-1"
                >
                  {getDateText()}
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showDatePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 mt-2 w-72 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 p-4 transition-colors duration-300"
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-white mb-1">Du</label>
                          <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg outline-none bg-white dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-white mb-1">Au</label>
                          <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                            min={filters.dateFrom}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg outline-none bg-white dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        {(filters.dateFrom || filters.dateTo) && (
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, dateFrom: "", dateTo: "" }))}
                            className="w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            Effacer dates
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          
            {/* PRICE CHIP */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-white">Prix:</span>
              <div className="relative" ref={priceDropdownRef}>
                <button
                  onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                  className="px-3 py-1 bg-orange-50 dark:bg-orange-900/40 dark:text-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors text-xs flex items-center gap-1"
                >
                  {getPriceText()}
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showPriceDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 mt-2 w-64 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 overflow-hidden transition-colors duration-300"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, priceSort: "low-to-high", priceMin: "", priceMax: "" }));
                            setShowPriceDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-orange-50 dark:hover:bg-orange-900/40 transition-colors flex items-center justify-between ${filters.priceSort === "low-to-high" ? "bg-orange-50 dark:bg-orange-900/40" : ""}`}
                        >
                          <span className="font-medium">Croissant</span>
                          {filters.priceSort === "low-to-high" && <Check className="w-4 h-4 text-orange-600" />}
                        </button>
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, priceSort: "high-to-low", priceMin: "", priceMax: "" }));
                            setShowPriceDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-orange-50 dark:hover:bg-orange-900/40 transition-colors flex items-center justify-between ${filters.priceSort === "high-to-low" ? "bg-orange-50 dark:bg-orange-900/40" : ""}`}
                        >
                          <span className="font-medium">Décroissant</span>
                          {filters.priceSort === "high-to-low" && <Check className="w-4 h-4 text-orange-600" />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          
            {/* CITY CHIP */}
            <div className="hidden md:flex items-center gap-2 text-sm relative overflow-visible">
              <span className="text-gray-500 dark:text-white">Ville:</span>
              <div className="relative overflow-visible" ref={cityDropdownDesktopRef}>
                <button
                  ref={cityButtonRef}
                  onClick={() => {
                    if (cityButtonRef.current) {
                      const rect = cityButtonRef.current.getBoundingClientRect();
                      setCityDropdownPosition({
                        top: rect.bottom + window.scrollY + 8,
                        left: rect.left + window.scrollX
                      });
                    }
                    setShowCityDropdown(!showCityDropdown);
                  }}
                  className="px-3 py-1 bg-green-50 dark:bg-green-900/40 dark:text-green-300 text-green-700 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/60 transition-colors text-xs flex items-center gap-1"
                >
                  {getLocationText()}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {/* City Dropdown Portal */}
                {showCityDropdown && typeof document !== 'undefined' && createPortal(
                  <AnimatePresence>
                    {showCityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          position: 'fixed',
                          top: `${cityDropdownPosition.top}px`,
                          left: `${cityDropdownPosition.left}px`,
                          zIndex: 9999
                        }}
                        className="w-64 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 max-h-64 overflow-hidden transition-colors duration-300"
                        ref={cityDropdownDesktopRef}
                      >
                        <div className="p-3 border-b border-purple-200/30">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Chercher..."
                              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg outline-none dark:bg-gray-700 dark:text-white"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          <button
                            onClick={() => handleLocationSelect("all")}
                            className={`w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors flex items-center justify-between ${filters.location === "all" ? "bg-green-50 dark:bg-green-900/40" : ""}`}
                          >
                            <span className="font-bold">Toutes</span>
                            {filters.location === "all" && <Check className="w-4 h-4 text-green-600" />}
                          </button>
                          {filteredCities.map((city) => (
                            <button
                              key={city}
                              onClick={() => handleLocationSelect(city)}
                              className={`w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors flex items-center justify-between ${filters.location === city ? "bg-green-50 dark:bg-green-900/40" : ""}`}
                            >
                              <span className="font-bold">{city}</span>
                              {filters.location === city && <Check className="w-4 h-4 text-green-600" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  , document.body
                )}
              </div>
            </div>
          </div>
          
          {/* Other preferences button - Right */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="p-2 text-gray-500 dark:text-white hover:text-red-600 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            )}
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleFilters}
              className="px-4 py-2 bg-purple-50 dark:bg-purple-900/40 dark:text-purple-300 text-purple-600 rounded-xl font-medium flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors duration-150 text-sm"
            >
              <span>{showFilters ? "Fermer" : "Autres filtres"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </motion.button>
          </div>
        </div>

        {/* Active filters badges */}
        {hasActiveFilters && appliedFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-purple-200/30 dark:border-purple-700/30"
          >
            {/* Example Badges - Simplified for brevity */}
            {appliedFilters.location !== "all" && (
              <span className="px-2 py-1 bg-green-100 dark:bg-white dark:text-gray-700 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {appliedFilters.location}
                <button onClick={() => setFilters(prev => ({ ...prev, location: "all" }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            {/* ... Add other badges as needed ... */}
          </motion.div>
        )}
      </div>

      {/* Brand Dropdown (Mobile) */}
      <AnimatePresence>
        {showBrandDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            ref={brandDropdownRef}
            className="absolute z-50 mt-2 w-full max-w-sm bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl p-2"
          >
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Chercher marque..." className="w-full p-2 border rounded" />
            <div className="max-h-48 overflow-y-auto mt-2">
              <button onClick={() => handleBrandSelect("")} className="w-full text-left p-2 hover:bg-gray-100">Toutes</button>
              {filteredBrands.map(brand => (
                <button key={brand} onClick={() => handleBrandSelect(brand)} className="w-full text-left p-2 hover:bg-gray-100">{brand}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-t border-purple-200/30 dark:border-purple-700/30"
          >
            <div className="p-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Section */}
                <div className="flex-1 space-y-6 md:pr-6 md:border-r md:border-purple-200/30">
                  
                  {/* Availability */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <Calendar className="w-4 h-4" /> <span>Disponibilité</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, availability: "all" }))}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${filters.availability === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}
                      >
                        Tout
                      </button>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, availability: "available" }))}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${filters.availability === "available" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}
                      >
                        Disponible
                      </button>
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <Car className="w-4 h-4" /> <span>Marque</span>
                    </label>
                    <div className="relative">
                      <select
                        value={filters.brand}
                        onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border rounded-lg outline-none appearance-none bg-white dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Toutes marques</option>
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Seats Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <Users className="w-4 h-4" /> <span>Places</span>
                    </label>
                    <div className="relative">
                      <select
                        value={filters.seats}
                        onChange={(e) => setFilters(prev => ({ ...prev, seats: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border rounded-lg outline-none appearance-none bg-white dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Toutes</option>
                        <option value="2">2 places</option>
                        <option value="4">4 places</option>
                        <option value="5">5 places</option>
                        <option value="7">7+ places</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex-1 space-y-6 md:pl-6">
                  {/* Transmission */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <Settings className="w-4 h-4" /> <span>Boîte de vitesse</span>
                    </label>
                    <div className="flex gap-2">
                      {[
                        { val: "", label: "Toutes" },
                        { val: "Manuelle", label: "Manuelle" },
                        { val: "Automatique", label: "Automatique" }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => setFilters(prev => ({ ...prev, type: opt.val }))}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${filters.type === opt.val ? "bg-indigo-100 text-indigo-700" : "bg-gray-100"}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fuel Type - ADAPTÉ À VOTRE JSON (Essence) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <Fuel className="w-4 h-4" /> <span>Carburant</span>
                    </label>
                    <div className="flex gap-2">
                      {[
                        { val: "", label: "Tous" },
                        { val: "Diesel", label: "Diesel" },
                        { val: "Essence", label: "Essence" } // Valeur correspondant au JSON
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => setFilters(prev => ({ ...prev, fuel: opt.val }))}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${filters.fuel === opt.val ? "bg-orange-100 text-orange-700" : "bg-gray-100"}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-4 flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={applyFilters}
                  disabled={!hasUnsavedChanges}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${
                    hasUnsavedChanges
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Appliquer</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default FiltersBar;