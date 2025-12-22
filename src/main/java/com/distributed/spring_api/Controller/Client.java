package com.distributed.spring_api.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.distributed.spring_api.Service.VoituresDes;
import com.distributed.spring_api.Service.VoitureService;
import com.distributed.spring_api.model.Voiture;

import org.springframework.ui.Model;

@Controller
public class Client {

    @Autowired
    private VoitureService voitureService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("voitures", voitureService.getAllVoitures());
        return "home";
    }

    @GetMapping("/voiture/{id}")
    public String detailsVoiture(@PathVariable int id, Model model) {

        Voiture v = voitureService.getVoitureById(id); // ✅ utiliser le service
        if (v == null) {
            return "redirect:/"; // si id existe pas → retour
        }

        model.addAttribute("voiture", v);

        return "voitureDesc"; // fichier HTML dans templates/
    }
}