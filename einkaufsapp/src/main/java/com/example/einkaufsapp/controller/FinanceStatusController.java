package com.example.einkaufsapp.controller;

import com.example.einkaufsapp.dto.FinanceStatusDTO;
import com.example.einkaufsapp.model.FinanceStatus;
import com.example.einkaufsapp.model.User;
import com.example.einkaufsapp.repository.FinanceStatusRepository;
import com.example.einkaufsapp.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/finance")
public class FinanceStatusController {

    private final FinanceStatusRepository financeStatusRepository;
    private final UserRepository userRepository;

    public FinanceStatusController(FinanceStatusRepository financeStatusRepository, UserRepository userRepository) {
        this.financeStatusRepository = financeStatusRepository;
        this.userRepository = userRepository;
    }

    // Instanz zwischen zwei Usern erstellen
    @PostMapping("/link")
    public ResponseEntity<String> linkWithPartner(@RequestBody Map<String, String> request, Authentication auth) {
        String currentUsername = auth.getName();
        String partnerUsername = request.get("partner");

        if (currentUsername.equals(partnerUsername)) {
            return ResponseEntity.badRequest().body("Du kannst dich nicht mit dir selbst verbinden.");
        }

        Optional<User> userAOpt = userRepository.findByUsername(currentUsername);
        Optional<User> userBOpt = userRepository.findByUsername(partnerUsername);

        if (userAOpt.isEmpty() || userBOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Benutzer nicht gefunden.");
        }

        User userA = userAOpt.get();
        User userB = userBOpt.get();

        boolean exists = financeStatusRepository.existsByUserAAndUserB(userA, userB) ||
                         financeStatusRepository.existsByUserBAndUserA(userA, userB);

        if (exists) {
            return ResponseEntity.badRequest().body("Instanz existiert bereits.");
        }

        FinanceStatus fs = new FinanceStatus();
        fs.setUserA(userA);
        fs.setUserB(userB);
        fs.setBalance(0.0);
        fs.setUpdatedAt(LocalDateTime.now());
        financeStatusRepository.save(fs);

        return ResponseEntity.ok("Instanz erstellt.");
    }

    // Alle relevanten Instanzen des Nutzers abrufen
    @GetMapping
    public ResponseEntity<List<FinanceStatusDTO>> getMyInstances(Authentication auth) {
        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User currentUser = userOpt.get();

        List<FinanceStatus> instances = financeStatusRepository.findByUserAOrUserB(currentUser, currentUser);

        List<FinanceStatusDTO> dtoList = instances.stream().map(fs -> {
            String partnerName = fs.getUserA().equals(currentUser)
                    ? fs.getUserB().getUsername()
                    : fs.getUserA().getUsername();
            return new FinanceStatusDTO(fs.getId(), partnerName, fs.getBalance());
        }).toList();

        return ResponseEntity.ok(dtoList);
    }

    // Zahlung registrieren und Balance entsprechend verändern
    @PostMapping("/{id}/add")
    public ResponseEntity<String> addAmount(@PathVariable Long id, @RequestParam double amount, Authentication auth) {
        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<FinanceStatus> fsOpt = financeStatusRepository.findById(id);

        if (userOpt.isEmpty() || fsOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Fehlerhafte Anfrage");
        }

        User currentUser = userOpt.get();
        FinanceStatus fs = fsOpt.get();

        if (!fs.getUserA().equals(currentUser) && !fs.getUserB().equals(currentUser)) {
            return ResponseEntity.status(403).body("Kein Zugriff auf diese Instanz");
        }

        // Balance anpassen: A zahlt = +, B zahlt = -
        double newBalance = fs.getUserA().equals(currentUser)
                ? fs.getBalance() + amount
                : fs.getBalance() - amount;

        fs.setBalance(newBalance);
        fs.setUpdatedAt(LocalDateTime.now());
        financeStatusRepository.save(fs);

        return ResponseEntity.ok("Balance aktualisiert");
    }
}