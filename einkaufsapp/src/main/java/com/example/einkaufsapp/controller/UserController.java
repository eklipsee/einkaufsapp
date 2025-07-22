package com.example.einkaufsapp.controller;

import com.example.einkaufsapp.model.User;
import com.example.einkaufsapp.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Zusätzliche CORS-Annotation
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public UserController(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        System.out.println("Registrierung versucht für: " + user.getUsername()); // Debug-Log
        
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        
        // Passwort aus dem temporären Feld nehmen und hashen
        String plainPassword = user.getPasswordForRegistration();
        if (plainPassword == null || plainPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        
        user.setPasswordHash(encoder.encode(plainPassword));
        userRepository.save(user);
        
        System.out.println("Benutzer erfolgreich registriert: " + user.getUsername()); // Debug-Log
        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);

        return userOpt.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
}