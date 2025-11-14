package com.example.passwordapp;

public class PasswordEntry {
    private int id;
    private String label;
    private String encryptedPassword;

    public PasswordEntry() {
    }

    public PasswordEntry(int id, String label, String encryptedPassword) {
        this.id = id;
        this.label = label;
        this.encryptedPassword = encryptedPassword;
    }

    public int getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }
}
