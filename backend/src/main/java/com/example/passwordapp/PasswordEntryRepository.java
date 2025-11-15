package com.example.passwordapp;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PasswordEntryRepository extends JpaRepository<PasswordEntry, Long> {
    List<PasswordEntry> findByUserId(Long userId);
}
