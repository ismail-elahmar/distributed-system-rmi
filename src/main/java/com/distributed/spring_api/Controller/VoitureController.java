package com.distributed.spring_api.Controller;

import com.distributed.spring_api.model.Voiture;
import com.distributed.spring_api.Service.VoitureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voitures")
@CrossOrigin(origins = "http://localhost:5173") // Indispensable pour React
public class VoitureController {

    @Autowired
    private VoitureService voitureService;

    @GetMapping
    public List<Voiture> getAll() {
        return voitureService.getAllVoitures();
    }

    // GET http://localhost:2000/api/voitures/disponibles
    @GetMapping("/disponibles")
    public List<Voiture> getDisponibles() {
        return voitureService.getVoituresDisponibles();
    }

    // GET http://localhost:2000/api/voitures/1
    @GetMapping("/{id}")
    public Voiture getById(@PathVariable int id) {
        return voitureService.getVoitureById(id);
    }
}