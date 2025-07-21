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
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public UserController(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already exists";
        }
        user.setPasswordHash(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered";
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
    String username = authentication.getName();
    Optional<User> userOpt = userRepository.findByUsername(username);

    return userOpt.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
}