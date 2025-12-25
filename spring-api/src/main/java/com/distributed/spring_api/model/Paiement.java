package com.distributed.spring_api.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "Paiement")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paiement_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "reservation_id", unique = true, nullable = false)
    private Reservation reservation;

    @Column(nullable = false)
    private Double montant;

    @CreationTimestamp
    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;

    // 'PENDING', 'PAID', 'FAILED'
    @Column(length = 20)
    private String statut;
}