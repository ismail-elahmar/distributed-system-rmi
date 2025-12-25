import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, CheckCircle2, XCircle, AlertCircle, Eye, X, 
  Car as CarIcon, ChevronRight, Trash2, FileText, MessageSquare, Tag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Configuration des statuts (Mapping API -> UI)
const statusConfig = {
  CONFIRMED: {
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-700",
    label: "Confirmée",
    badgeColor: "bg-emerald-500",
  },
  PENDING: {
    icon: AlertCircle,
    color: "bg-blue-50 text-blue-700",
    label: "En attente",
    badgeColor: "bg-blue-500",
  },
  COMPLETED: {
    icon: CheckCircle2,
    color: "bg-gray-100 text-gray-700",
    label: "Terminée",
    badgeColor: "bg-gray-500",
  },
  CANCELLED: {
    icon: XCircle,
    color: "bg-red-50 text-red-700",
    label: "Annulée",
    badgeColor: "bg-red-500",
  }
};

// Fonctions utilitaires
const formatDate = (dateString) => {
  if(!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' });
};

const calculateDaysTotal = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
};

// --- COMPOSANT CARTE RÉSERVATION ---
const BookingCard = ({ booking, onCancel, onViewDetails }) => {
  const statusInfo = statusConfig[booking.status] || statusConfig.PENDING;
  const totalDays = calculateDaysTotal(booking.dateDebut, booking.dateFin);
  const isCancellable = booking.status === 'CONFIRMED' || booking.status === 'PENDING';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className="text-xs text-gray-500">REF-{booking.id}</span>
            </div>
            {/* Données venant de l'objet Voiture imbriqué dans Reservation */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {booking.voiture?.marque} {booking.voiture?.modele}
            </h3>
            <p className="text-sm text-gray-600 dark:text-white/70">{booking.voiture?.agenceNom}</p>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{booking.total} MAD</div>
            <div className="text-sm text-gray-500 dark:text-white/70">{totalDays} jour{totalDays > 1 ? 's' : ''}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-white mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(booking.dateDebut)}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(booking.dateFin)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-purple-800/30">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetails(booking)}
            className="flex-1 py-2 px-3 bg-gray-50 dark:bg-indigo-900/60 text-gray-700 dark:text-white rounded-md font-medium hover:bg-gray-100 dark:hover:bg-indigo-900/80 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Détails</span>
          </motion.button>

          {isCancellable && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCancel(booking)}
              className="py-2 px-3 bg-red-50 text-red-700 rounded-md font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Annuler</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- MODAL CONFIRMATION ANNULATION ---
const CancelConfirmationModal = ({ booking, onClose, onConfirm }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg p-6 max-w-md w-full border border-gray-200 dark:border-purple-800/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg"><AlertCircle className="w-6 h-6 text-red-600" /></div>
          <div><h3 className="text-lg font-semibold dark:text-white">Confirmer l'annulation</h3><p className="text-sm text-gray-500">REF-{booking.id}</p></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Êtes-vous sûr de vouloir annuler la réservation pour la <b>{booking.voiture?.marque} {booking.voiture?.modele}</b> ? Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">Non, garder</button>
          <button onClick={() => onConfirm(booking)} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Oui, annuler</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MODAL DÉTAILS ---
const BookingDetailsModal = ({ booking, onClose }) => {
  const totalDays = calculateDaysTotal(booking.dateDebut, booking.dateFin);
  const statusInfo = statusConfig[booking.status];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-indigo-950 rounded-2xl shadow-lg max-w-2xl w-full overflow-hidden border border-gray-200 dark:border-purple-800/30">
        <div className="p-4 border-b border-gray-200 dark:border-purple-800/30 flex justify-between items-center bg-gray-50 dark:bg-indigo-900/20">
          <h3 className="font-bold text-lg dark:text-white">Détails de la réservation</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <img src={booking.voiture?.imageUrl} alt="Car" className="w-24 h-24 object-cover rounded-lg bg-gray-200" />
            <div>
              <h4 className="text-xl font-bold dark:text-white">{booking.voiture?.marque} {booking.voiture?.modele}</h4>
              <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${statusInfo?.color}`}>{statusInfo?.label}</span>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300"><Tag className="w-3 h-3 inline mr-1"/> {booking.voiture?.agenceNom}</p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-indigo-900/20 p-4 rounded-lg grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500">Début</p><p className="font-medium dark:text-white">{formatDate(booking.dateDebut)}</p></div>
            <div><p className="text-xs text-gray-500">Fin</p><p className="font-medium dark:text-white">{formatDate(booking.dateFin)}</p></div>
            <div className="col-span-2 text-center border-t border-gray-200 dark:border-purple-800/30 pt-2 mt-2"><p className="text-sm dark:text-white">Durée totale : {totalDays} jours</p></div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-purple-800/30">
            <span className="font-semibold dark:text-white">Total payé</span>
            <span className="text-2xl font-bold text-indigo-600 dark:text-purple-400">{booking.total} MAD</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- EMPTY STATE ---
const EmptyState = ({ onExplore }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6"><Calendar className="w-10 h-10 text-gray-400" /></div>
    <h3 className="text-xl font-semibold dark:text-white mb-2">Aucune réservation</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-8">Vous n'avez pas encore réservé de véhicule.</p>
    <button onClick={onExplore} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 mx-auto"><CarIcon className="w-5 h-5" /> Explorer les véhicules</button>
  </motion.div>
);

// --- COMPOSANT PRINCIPAL ---
export default function MyBookings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // CHARGEMENT DES DONNÉES DEPUIS SPRING BOOT
  useEffect(() => {
    const fetchBookings = async () => {
      const currentUser = JSON.parse(localStorage.getItem("carrent_current_user"));
      
      if (!currentUser) {
        navigate("/signin");
        return;
      }

      try {
        const response = await fetch(`http://localhost:2000/api/reservations/client/${currentUser.id}`);
        if (response.ok) {
          const data = await response.json();
          // Trier par date décroissante (plus récent en premier)
          const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setBookings(sortedData);
        } else {
          console.error("Erreur chargement réservations");
        }
      } catch (error) {
        console.error("Erreur serveur:", error);
        toast.error("Impossible de charger vos réservations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const filteredBookings = filter === "ALL" 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  // ANNULATION VIA SPRING BOOT
  const handleCancelConfirm = async (booking) => {
    try {
        const response = await fetch(`http://localhost:2000/api/reservations/${booking.id}/cancel`, {
            method: 'PUT'
        });

        if (response.ok) {
            // Mise à jour locale de l'état pour éviter de recharger toute la page
            const updatedBookings = bookings.map(b => 
                b.id === booking.id ? { ...b, status: 'CANCELLED' } : b
            );
            setBookings(updatedBookings);
            toast.success("Réservation annulée avec succès");
        } else {
            const errorMsg = await response.text();
            toast.error(errorMsg || "Erreur lors de l'annulation");
        }
    } catch (err) {
        console.error(err);
        toast.error("Erreur de connexion au serveur");
    } finally {
        setShowCancelModal(false);
        setBookingToCancel(null);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Statistiques pour les filtres
  const stats = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center dark:bg-[#1a0f24]">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a0f24] pt-24 pb-12 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
        
        {/* Titre */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Réservations</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Gérez vos locations et consultez votre historique.</p>
        </div>

        {/* Filtres */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: "ALL", label: "Toutes", count: stats.all },
              { id: "CONFIRMED", label: "Confirmées", count: stats.confirmed },
              { id: "PENDING", label: "En attente", count: stats.pending },
              { id: "COMPLETED", label: "Terminées", count: stats.completed },
              { id: "CANCELLED", label: "Annulées", count: stats.cancelled },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                  filter === item.id
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/50"
                    : "bg-white dark:bg-gray-800/40 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 border-gray-200 dark:border-gray-700/50"
                }`}
              >
                {item.label} <span className="ml-2 text-xs opacity-75 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded-full">{item.count}</span>
              </motion.button>
            ))}
        </motion.div>

        {/* Liste */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredBookings.length > 0 ? (
              <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelClick}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </motion.div>
            ) : (
              <EmptyState onExplore={() => navigate("/catalogue")} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDetailsModal && selectedBooking && (
          <BookingDetailsModal booking={selectedBooking} onClose={() => setShowDetailsModal(false)} />
        )}
        {showCancelModal && bookingToCancel && (
          <CancelConfirmationModal booking={bookingToCancel} onClose={() => { setShowCancelModal(false); setBookingToCancel(null); }} onConfirm={handleCancelConfirm} />
        )}
      </AnimatePresence>
    </div>
  );
}