package com.distributed.spring_api.repository;

import com.distributed.spring_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Méthode pour trouver un utilisateur par email (utile pour le login)
    Optional<User> findByEmail(String email);

    // Méthode pour vérifier si l'email existe déjà (utile pour l'inscription)
    Boolean existsByEmail(String email);
}