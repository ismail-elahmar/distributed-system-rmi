package com.distributed.spring_api.repository;

import com.distributed.spring_api.model.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    // Trouver un paiement via l'ID de la réservation
    // Note: Dans JPA, on utilise le "_" pour naviguer dans l'objet lié (Reservation
    // -> id)
    Optional<Paiement> findByReservation_Id(Long reservationId);
}