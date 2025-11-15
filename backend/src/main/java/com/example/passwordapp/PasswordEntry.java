package com.example.passwordapp;

import jakarta.persistence.*;

@Entity
@Table(name = "password_entries")
public class PasswordEntry {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;
    private String encryptedPassword;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public PasswordEntry() {}

    public PasswordEntry(String label, String encryptedPassword, User user) {
        this.label = label;
        this.encryptedPassword = encryptedPassword;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public User getUser() {
        return user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
