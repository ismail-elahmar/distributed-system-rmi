package com.distributed.spring_api.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "Voiture")
public class Voiture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("voiture_id")
    private int voitureId;

    @Column(name = "locateur_id")
    @JsonProperty("locateur_id")
    private int locateurId;

    @Column(name = "agence_nom")
    @JsonProperty("agence_nom")
    private String agenceNom;

    @Column(name = "agence_adresse")
    @JsonProperty("agence_adresse")
    private String agenceAdresse;

    @Column(name = "agence_phone")
    @JsonProperty("agence_phone")
    private String agencePhone;

    private String marque;
    private String modele;

    @Column(name = "prix_par_jour")
    @JsonProperty("prix_par_jour")
    private double prixParJour;

    private boolean disponibilite;

    @Column(name = "image_url")
    @JsonProperty("image_url")
    private String imageUrl;

    private String carburant;

    public Voiture() {
    }

    // --- GETTERS ET SETTERS ---

    public int getVoitureId() {
        return voitureId;
    }

    public void setVoitureId(int voitureId) {
        this.voitureId = voitureId;
    }

    public int getLocateurId() {
        return locateurId;
    }

    public void setLocateurId(int locateurId) {
        this.locateurId = locateurId;
    }

    public String getAgenceNom() {
        return agenceNom;
    }

    public void setAgenceNom(String agenceNom) {
        this.agenceNom = agenceNom;
    }

    public String getAgenceAdresse() {
        return agenceAdresse;
    }

    public void setAgenceAdresse(String agenceAdresse) {
        this.agenceAdresse = agenceAdresse;
    }

    public String getAgencePhone() {
        return agencePhone;
    }

    public void setAgencePhone(String agencePhone) {
        this.agencePhone = agencePhone;
    }

    public String getMarque() {
        return marque;
    }

    public void setMarque(String marque) {
        this.marque = marque;
    }

    public String getModele() {
        return modele;
    }

    public void setModele(String modele) {
        this.modele = modele;
    }

    public double getPrixParJour() {
        return prixParJour;
    }

    public void setPrixParJour(double prixParJour) {
        this.prixParJour = prixParJour;
    }

    public boolean isDisponibilite() {
        return disponibilite;
    }

    public void setDisponibilite(boolean disponibilite) {
        this.disponibilite = disponibilite;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCarburant() {
        return carburant;
    }

    public void setCarburant(String carburant) {
        this.carburant = carburant;
    }
}