package com.distributed.spring_api.Service;

import com.distributed.spring_api.model.Paiement;
import com.distributed.spring_api.repository.PaiementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaiementService {

    @Autowired
    private PaiementRepository paiementRepo;

    // Récupérer tous les paiements (Pour un tableau de bord Admin)
    public List<Paiement> getAllPaiements() {
        return paiementRepo.findAll();
    }

    // Récupérer le paiement d'une réservation spécifique
    public Paiement getPaiementByReservationId(Long reservationId) {
        return paiementRepo.findByReservation_Id(reservationId)
                .orElse(null);
    }

    // Simuler un remboursement (Admin)
    public Paiement refundPaiement(Long paiementId) {
        Paiement paiement = paiementRepo.findById(paiementId).orElseThrow();
        paiement.setStatut("REFUNDED");
        // Logique métier : Changer aussi le statut de la réservation en CANCELLED si
        // nécessaire
        return paiementRepo.save(paiement);
    }
}