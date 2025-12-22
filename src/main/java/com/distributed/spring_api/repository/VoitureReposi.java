package com.distributed.spring_api.repository;

import com.distributed.spring_api.model.Voiture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VoitureReposi extends JpaRepository<Voiture, Integer> {

    List<Voiture> findByDisponibilite(boolean disponibilite);

    List<Voiture> findAll();

}
