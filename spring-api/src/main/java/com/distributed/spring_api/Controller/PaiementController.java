package com.distributed.spring_api.Controller;

import com.distributed.spring_api.model.Paiement;
import com.distributed.spring_api.Service.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin(origins = "http://localhost:5173")
public class PaiementController {

    @Autowired
    private PaiementService paiementService;

    // GET http://localhost:2000/api/paiements
    @GetMapping
    public List<Paiement> getAll() {
        return paiementService.getAllPaiements();
    }

    // GET http://localhost:2000/api/paiements/reservation/5
    @GetMapping("/reservation/{resId}")
    public ResponseEntity<?> getByReservation(@PathVariable Long resId) {
        Paiement p = paiementService.getPaiementByReservationId(resId);
        if (p != null) {
            return ResponseEntity.ok(p);
        }
        return ResponseEntity.notFound().build();
    }
}