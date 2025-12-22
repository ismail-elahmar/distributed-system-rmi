package com.distributed.spring_api.Controller;

import com.distributed.spring_api.dto.LoginRequest;
import com.distributed.spring_api.dto.SignupRequest;
import com.distributed.spring_api.model.User;
import com.distributed.spring_api.repository.UserRepository;
import com.distributed.spring_api.rmi.IVerificationServiceRemote; // <--- 1. IMPORT RMI

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.rmi.Naming; // <--- 2. IMPORT NAMING
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // --- INSCRIPTION (SIGN UP) ---
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {

        // 1. Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Erreur: Cet email est déjà utilisé !");
        }

        // =================================================================
        // 🚨 DÉBUT INTÉGRATION RMI (Vérification Police)
        // =================================================================

        // On suppose que votre SignupRequest a un champ 'cin' (ex: request.getCin())
        // Si le rôle est 'client', on vérifie son casier judiciaire
        if ("client".equalsIgnoreCase(request.getRole())) {
            try {
                System.out.println("👮 Connexion au serveur Police (RMI port 1100)...");

                // 1. Connexion au serveur distant
                IVerificationServiceRemote policeService = (IVerificationServiceRemote) Naming
                        .lookup("rmi://localhost:1100/PoliceService");

                // 2. Appel de la méthode de vérification
                // (Assurez-vous d'avoir ajouté le champ 'cin' dans SignupRequest.java)
                String cinClient = request.getCin(); // <--- Champ à ajouter dans le DTO
                boolean isClean = policeService.verifierCitoyen(cinClient, "PERMIS-CHECK");

                // 3. Si le citoyen est blacklisté, on REFUSE l'inscription
                if (!isClean) {
                    System.out.println("⛔ ALERTE : Citoyen blacklisté tenté de s'inscrire !");
                    return ResponseEntity.status(403)
                            .body("Inscription refusée : Vérification administrative échouée (Service Police).");
                }

                System.out.println("✅ Vérification Police OK.");

            } catch (Exception e) {
                // Si le serveur RMI est éteint, on affiche l'erreur
                System.err.println("⚠️ Erreur RMI Police : " + e.getMessage());
                // Choix : Soit on bloque (plus sécurisé), soit on laisse passer (mode dégradé)
                // return ResponseEntity.internalServerError().body("Service de vérification
                // indisponible.");
            }
        }
        // =================================================================
        // 🚨 FIN INTÉGRATION RMI
        // =================================================================

        // 2. Créer l'utilisateur (Si RMI est OK)
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        // On peut aussi stocker le CIN si vous l'avez ajouté au modèle User
        // user.setCin(request.getCin());

        // 3. Sauvegarder
        userRepository.save(user);

        return ResponseEntity.ok("Utilisateur enregistré avec succès !");
    }

    // --- CONNEXION (SIGN IN) ---
    // (Le reste du code reste inchangé)
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("name", user.getFullName());
                response.put("email", user.getEmail());
                response.put("role", user.getRole());
                response.put("phone", user.getPhone());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.badRequest().body("Email ou mot de passe incorrect");
    }
}