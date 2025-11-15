package com.example.passwordapp;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PasswordController {

    private final PasswordEntryRepository passwordEntryRepository;
    private final AuthService authService;

    public PasswordController(PasswordEntryRepository passwordEntryRepository, AuthService authService) {
        this.passwordEntryRepository = passwordEntryRepository;
        this.authService = authService;
    }

    // helper: extragem user din header-ul Authorization: Bearer <token>
    private User getUserFromAuthHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Lipsă token");
        }
        String token = authorizationHeader.substring(7);
        return authService
                .getUserFromToken(token)
                .orElseThrow(() -> new RuntimeException("Token invalid sau expirat"));
    }

    @PostMapping("/passwords")
    public ResponseEntity<?> savePassword(
            @RequestHeader("Authorization") String authorization,
            @RequestBody PasswordRequest request
    ) {
        try {
            User user = getUserFromAuthHeader(authorization);
            String encrypted = CryptoUtil.encrypt(request.getPassword());
            PasswordEntry entry = new PasswordEntry(request.getLabel(), encrypted, user);
            passwordEntryRepository.save(entry);
            return ResponseEntity.ok("Parola salvată!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Eroare la salvare: " + e.getMessage());
        }
    }

    
    @GetMapping("/passwords")
    public ResponseEntity<?> getAllPasswords(@RequestHeader("Authorization") String authorization) {
        try {
            User user = getUserFromAuthHeader(authorization);
            List<PasswordEntry> list = passwordEntryRepository.findByUserId(user.getId());
            return ResponseEntity.ok(list);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(401).body("Neautorizat: " + ex.getMessage());
        }
    }

    @GetMapping("/passwords/{id}/reveal")
    public ResponseEntity<?> revealPassword(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id
    ) {
        try {
            User user = getUserFromAuthHeader(authorization);
            PasswordEntry entry = passwordEntryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Parola nu există"));

            if (!entry.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Nu ai voie să vezi parola altui user.");
            }

            String decrypted = CryptoUtil.decrypt(entry.getEncryptedPassword());
            return ResponseEntity.ok(decrypted);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Eroare la decriptare: " + e.getMessage());
        }
    }
}
