package com.example.passwordapp;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;

    // token -> userId
    private final Map<String, Long> sessions = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String email, String username, String password) {
        // verificări simple
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email deja folosit");
        }
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username deja folosit");
        }

        String hash = BCrypt.hashpw(password, BCrypt.gensalt());
        User user = new User(email, username, hash);
        return userRepository.save(user);
    }

    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email sau parolă greșită");
        }
        User user = userOpt.get();
        if (!BCrypt.checkpw(password, user.getPasswordHash())) {
            throw new RuntimeException("Email sau parolă greșită");
        }

        // generăm token simplu
        String token = UUID.randomUUID().toString();
        sessions.put(token, user.getId());
        return token;
    }

    public Long getUserIdFromToken(String token) {
        return sessions.get(token);
    }

    public Optional<User> getUserFromToken(String token) {
        Long userId = getUserIdFromToken(token);
        if (userId == null) return Optional.empty();
        return userRepository.findById(userId);
    }
}
