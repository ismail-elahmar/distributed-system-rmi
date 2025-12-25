// src/pages/CarDetailsPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Building, ArrowLeft, MapPin, Users, Fuel, Settings, Calendar, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

export default function CarDetailsPage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const imageRef = useRef(null);
  const zoomContainerRef = useRef(null);

  // Load car data
  useEffect(() => {
    // Get cars from localStorage or API
    const cars = JSON.parse(localStorage.getItem("carrent_cars") || "[]");
    const foundCar = cars.find(c => c.id === carId || c.id?.toString() === carId);
    
    if (foundCar) {
      setCar(foundCar);
    } else {
      toast.error("Car not found");
      navigate("/catalogue");
    }
  }, [carId, navigate]);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Ensure main image is first in the slider
  const images = car?.mainImage 
    ? [car.mainImage, ...(car.images?.filter(img => img !== car.mainImage) || [])]
    : car?.images && car.images.length > 0 ? car.images : [];
  
  const activeImage = images[activeIndex] || car?.mainImage;
  const isAvailable = car.availability === "available" || car.available === true || car.availability === true;

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [images.length]);

  // Touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setIsZoomed(false);
        setImagePosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleImageClick = () => {
    if (!isZoomed) {
      setIsZoomed(true);
      setZoomLevel(2);
    }
  };

  const handleMouseDown = (e) => {
    if (isZoomed && zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate("/catalogue");
      } else if (e.key === "ArrowLeft" && images.length > 1) {
        prevImage();
      } else if (e.key === "ArrowRight" && images.length > 1) {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, prevImage, nextImage, images.length]);

  // Zoom and drag handlers
  useEffect(() => {
    if (isZoomed) {
      const wheelHandler = (e) => {
        if (isZoomed) {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.2 : 0.2;
          setZoomLevel(prev => {
            const newZoom = Math.max(1, Math.min(prev + delta, 5));
            if (newZoom === 1) {
              setIsZoomed(false);
              setImagePosition({ x: 0, y: 0 });
            }
            return newZoom;
          });
        }
      };

      const mouseMoveHandler = (e) => {
        if (isDragging && isZoomed) {
          setImagePosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
          });
        }
      };

      const mouseUpHandler = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('wheel', wheelHandler, { passive: false });
      return () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [isZoomed, isDragging, dragStart]);

  const handleReserve = () => {
    navigate(`/reservation/${car.id}`);
    toast.success("Redirecting to reservation page");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-[#1a0f24] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/catalogue")}
          className="mb-6 flex items-center gap-2 text-gray-700 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Catalogue</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 md:gap-8">
          {/* Image Gallery */}
          <div className="bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 transition-colors duration-300 p-3 md:p-4 flex flex-col">
            {/* Main Image Slider */}
            <div className="relative overflow-hidden rounded-lg mb-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" style={{ minHeight: '300px' }}>
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
                      transition={{ duration: 0.2 }}
                      className="w-full h-full flex items-center justify-center p-4 cursor-zoom-in"
                      ref={zoomContainerRef}
                      onClick={handleImageClick}
                      onMouseDown={handleMouseDown}
                      style={{ overflow: isZoomed ? 'hidden' : 'visible' }}
                    >
                      <motion.img
                        src={activeImage}
                        alt={`${car.name} - Image ${activeIndex + 1}`}
                        className={`max-w-full max-h-full object-contain rounded-xl shadow-lg transition-transform duration-200 ${
                          isZoomed ? 'cursor-move' : 'cursor-zoom-in'
                        }`}
                        style={{
                          transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel})`,
                          transformOrigin: 'center center'
                        }}
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <p>No image available</p>
                    </div>
                  )}
                </AnimatePresence>

                {/* Navigation Arrows - Light purple, inside image card */}
                {images.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-8 h-8 text-purple-300 dark:text-purple-400 drop-shadow-lg" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-8 h-8 text-purple-300 dark:text-purple-400 drop-shadow-lg" />
                    </motion.button>
                  </>
                )}

                {/* Zoom Controls */}
                {isZoomed && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 p-2 bg-black/70 backdrop-blur-sm rounded-lg z-20">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoomIn();
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
                      disabled={zoomLevel >= 5}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </motion.button>
                    <span className="text-white text-xs px-2">{Math.round(zoomLevel * 100)}%</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoomOut();
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
                      disabled={zoomLevel <= 1}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomLevel(1);
                        setIsZoomed(false);
                        setImagePosition({ x: 0, y: 0 });
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded text-white transition-colors text-xs"
                    >
                      Reset
                    </motion.button>
                  </div>
                )}

              </div>
            </div>

            {/* Photo Counter */}
            {images.length > 0 && (
              <div className="text-center mb-2">
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {activeIndex + 1} / {images.length} photos
                </span>
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mb-2">
                <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-purple-700 scrollbar-track-transparent">
                  {images.map((src, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveIndex(i);
                        setIsZoomed(false);
                        setZoomLevel(1);
                        setImagePosition({ x: 0, y: 0 });
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        activeIndex === i
                          ? "border-indigo-600 dark:border-purple-400 shadow-lg ring-2 ring-indigo-200 dark:ring-purple-800"
                          : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-purple-500"
                      }`}
                    >
                      <img 
                        src={src} 
                        alt={`Thumbnail ${i + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Fine line separator */}
            <div className="h-px bg-gray-200 dark:bg-purple-800/30 mb-3"></div>

            {/* Action Buttons */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReserve}
              disabled={!isAvailable}
              className={`w-full py-3 px-4 sm:py-4 sm:px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-150 flex items-center justify-center gap-2 ${
                isAvailable
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm sm:text-base">Book now</span>
            </motion.button>
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-indigo-950/40 rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mt-4 md:mt-0">
            <div className="space-y-5">
              {/* Owner with Profile Picture */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold border-2 border-white dark:border-purple-800/50 shadow-md">
                  {car?.owner ? car.owner.charAt(0).toUpperCase() : 'O'}
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {car?.owner ?? "—"}
                </p>
              </div>
              
              {/* Fine line separator */}
              <div className="h-px bg-gray-200 dark:bg-purple-800/30"></div>
              
              {/* Car Name */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {car?.name}
                </h1>
              </div>

              {/* Car Details Section */}
              <div>
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-purple-400">
                    Car details:
                  </h3>
                </div>
                
                <div className="space-y-2 pl-0">
                  {/* City */}
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                    <span>City: <span className="font-medium">{car.city || "—"}</span></span>
                  </div>

                  {/* Brand */}
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Settings className="w-4 h-4 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                    <span>Brand: <span className="font-medium">{car.brand || "—"}</span></span>
                  </div>

                  {/* Seats */}
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Users className="w-4 h-4 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                    <span>Seats: <span className="font-medium">{car.seats || "—"}</span></span>
                  </div>

                  {/* Type (Transmission) */}
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Settings className="w-4 h-4 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                    <span>Type: <span className="font-medium">{car.gearbox || car.type || "—"}</span></span>
                  </div>

                  {/* Fuel Type */}
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Fuel className="w-4 h-4 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                    <span>Fuel Type: <span className="font-medium">{car.fuel || "—"}</span></span>
                  </div>

                  {/* Times Rented */}
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                    <span>Times Rented: <span className="font-medium">{car.timesRented !== undefined ? car.timesRented : "—"}</span></span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                    <span>Minimum Rating: <span className="font-medium">{car.rating !== undefined ? `${car.rating} / 5` : "—"}</span></span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-purple-400 mb-3">
                  Description:
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {car.description || car.ownerDescription || "No description provided by the owner."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

