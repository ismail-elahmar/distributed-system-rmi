package com.distributed.spring_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Indispensable pour le POST
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Indispensable pour React
                .authorizeHttpRequests(auth -> auth
                        // Autoriser l'authentification
                        .requestMatchers("/api/auth/**").permitAll()

                        // Autoriser la consultation des voitures
                        .requestMatchers("/api/voitures/**").permitAll()

                        // 👇 AJOUTEZ CETTE LIGNE 👇
                        // Autoriser la création de réservation (POST) et lecture
                        .requestMatchers("/api/reservations/**").permitAll()

                        // Autoriser la lecture des paiements (si nécessaire)
                        .requestMatchers("/api/paiements/**").permitAll()

                        // Tout le reste nécessite une connexion (Token/Session)
                        .anyRequest().authenticated());

        return http.build();
    }

    // ... (Le reste de votre méthode corsConfigurationSource reste inchangé) ...
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}