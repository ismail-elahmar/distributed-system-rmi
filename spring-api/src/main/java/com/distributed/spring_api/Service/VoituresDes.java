package com.distributed.spring_api.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.distributed.spring_api.repository.VoitureReposi;
import com.distributed.spring_api.model.Voiture;
import java.util.List;

@Service
public class VoituresDes {

    @Autowired
    private VoitureReposi voitureRepository;

    public List<Voiture> getAllVoitures() {
        return voitureRepository.findAll();
    }

    public Voiture getVoitureById(int id) {
        return voitureRepository.findById(id).orElse(null);
    }
}
