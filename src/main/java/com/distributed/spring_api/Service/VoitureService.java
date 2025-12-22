package com.distributed.spring_api.Service;

import com.distributed.spring_api.model.Voiture;
import com.distributed.spring_api.repository.VoitureReposi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoitureService {

    @Autowired
    private VoitureReposi repo;

    public List<Voiture> getAllVoitures() {
        return repo.findAll();
    }

    public List<Voiture> getVoituresDisponibles() {
        return repo.findByDisponibilite(true);
    }

    public Voiture getVoitureById(int id) {
        return repo.findById(id).orElse(null);
    }
}