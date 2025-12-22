package com.distributed.spring_api.Service;

import com.distributed.spring_api.dto.ReservationRequest;
import com.distributed.spring_api.model.*;
import com.distributed.spring_api.repository.*;
import com.distributed.spring_api.rmi.IPaymentServiceRemote; // Import de l'interface

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.rmi.Naming; // Nécessaire pour RMI
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReservationService {

    @Autowired private ReservationRepository reservationRepo;
    @Autowired private PaiementRepository paiementRepo;
    @Autowired private VoitureReposi voitureRepo;
    @Autowired private UserRepository userRepo;

    @Transactional
    public Reservation createReservation(ReservationRequest request) throws Exception {

        // ... (Code de récupération et calculs inchangé) ...
        // ... (1. Récupération Voiture/Client) ...
        Voiture voiture = voitureRepo.findById(request.getVoitureId())
             .orElseThrow(() -> new Exception("Voiture introuvable"));
        User client = userRepo.findById(request.getClientId())
             .orElseThrow(() -> new Exception("Client introuvable"));

        // ... (2. Vérifs Disponibilité) ...
        boolean isBooked = reservationRepo.existsOverlappingReservation(
                voiture.getVoitureId(), request.getStartDate(), request.getEndDate());
        if (isBooked || !voiture.isDisponibilite()) {
            throw new Exception("Cette voiture n'est plus disponible.");
        }

        // ... (3. Calculs prix) ...
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days < 1) days = 1;
        double totalAmount = days * voiture.getPrixParJour();

        // 4. Création Réservation (PENDING)
        Reservation reservation = new Reservation();
        reservation.setClient(client);
        reservation.setVoiture(voiture);
        reservation.setDateDebut(request.getStartDate());
        reservation.setDateFin(request.getEndDate());
        reservation.setTotal(totalAmount);
        reservation.setStatus("PENDING");
        Reservation savedReservation = reservationRepo.save(reservation);

        // 5. Traitement du Paiement via RMI
        Paiement paiement = new Paiement();
        paiement.setReservation(savedReservation);
        paiement.setMontant(totalAmount);

        boolean paymentSuccess = false;

        // --- DÉBUT LOGIQUE RMI ---
        try {
            System.out.println("🔄 Connexion au serveur bancaire RMI...");
            
            // Recherche du service distant
            IPaymentServiceRemote banqueDistante = (IPaymentServiceRemote) Naming.lookup("rmi://localhost:1099/PaymentService");
            
            // Préparation des données (Carte fictive si cash, ou vraie carte)
            String cardData = "cash".equalsIgnoreCase(request.getPaymentMethod()) 
                            ? "CASH-AGENCE" 
                            : "CARD-1234-5678-9012";

            // Appel de la méthode distante (RPC)
            paymentSuccess = banqueDistante.processPayment(cardData, totalAmount);
            
            System.out.println("Réponse de la banque : " + paymentSuccess);

        } catch (Exception e) {
            System.err.println("⚠️ Erreur critique RMI : " + e.getMessage());
            // En cas de panne du serveur banque, on refuse le paiement par sécurité
            paymentSuccess = false;
        }
        // --- FIN LOGIQUE RMI ---

        if (paymentSuccess) {
            paiement.setStatut("PAID");
            savedReservation.setStatus("CONFIRMED");
            
            // Mise à jour voiture
            voiture.setDisponibilite(false);
            voitureRepo.save(voiture);
        } else {
            paiement.setStatut("FAILED");
            savedReservation.setStatus("CANCELLED");
        }

        paiementRepo.save(paiement);
        return savedReservation;
    }

    // (Les autres méthodes getReservationsByClient et cancelReservation restent inchangées)
    public List<Reservation> getReservationsByClient(Long clientId) {
        return reservationRepo.findByClient_Id(clientId);
    }

    public Reservation cancelReservation(Long reservationId) throws Exception {
        Reservation res = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new Exception("Réservation introuvable"));
        if ("COMPLETED".equals(res.getStatus())) throw new Exception("Impossible d'annuler une réservation terminée.");
        
        res.setStatus("CANCELLED");
        Voiture voiture = res.getVoiture();
        voiture.setDisponibilite(true);
        voitureRepo.save(voiture);
        return reservationRepo.save(res);
    }
}