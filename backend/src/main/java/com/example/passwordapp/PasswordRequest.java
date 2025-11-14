package com.example.passwordapp;

public class PasswordRequest {
    private String label;    // numele parolei (ex: Instagram)
    private String password; // parola propriu-zisă

    public PasswordRequest() {
    }

    public PasswordRequest(String label, String password) {
        this.label = label;
        this.password = password;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
