package com.example.passwordapp;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // permite orice port de pe localhost (React 3000/3001/3002)
public class PasswordController {

    private final List<PasswordEntry> entries = new ArrayList<>();
    private int nextId = 1;

    // Adaugă o parolă nouă
    @PostMapping("/passwords")
    public PasswordEntry savePassword(@RequestBody PasswordRequest request) {
        try {
            String encrypted = CryptoUtil.encrypt(request.getPassword());
            PasswordEntry entry = new PasswordEntry(nextId++, request.getLabel(), encrypted);
            entries.add(entry);

            // Nu trimitem parola criptată neapărat, dar pentru simplitate o lăsăm
            return entry;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Eroare la criptare");
        }
    }

    // Lista tuturor parolelor (fără decriptare)
    @GetMapping("/passwords")
    public List<PasswordEntry> getAllPasswords() {
        return entries;
    }

    // Decriptează o parolă după id
    @GetMapping("/passwords/{id}/reveal")
    public String revealPassword(@PathVariable int id) {
        try {
            for (PasswordEntry entry : entries) {
                if (entry.getId() == id) {
                    return CryptoUtil.decrypt(entry.getEncryptedPassword());
                }
            }
            return "Parolă inexistentă.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Eroare la decriptare.";
        }
    }
}
