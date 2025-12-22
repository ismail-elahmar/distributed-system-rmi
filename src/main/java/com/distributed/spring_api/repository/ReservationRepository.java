package com.distributed.spring_api.repository;

import com.distributed.spring_api.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Vérifier si la voiture est déjà réservée pour ces dates (Chevauchement de
    // dates)
    @Query("SELECT COUNT(r) > 0 FROM Reservation r " +
            "WHERE r.voiture.voitureId = :voitureId " +
            "AND r.status <> 'CANCELLED' " +
            "AND (r.dateDebut <= :fin AND r.dateFin >= :debut)")
    boolean existsOverlappingReservation(@Param("voitureId") int voitureId,
            @Param("debut") LocalDate debut,
            @Param("fin") LocalDate fin);

    List<Reservation> findByClient_Id(Long clientId);
}