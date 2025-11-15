package com.example.passwordapp;

public class PasswordRequest {
    private String label;
    private String password;

    public PasswordRequest() {}

    public String getLabel() {
        return label;
    }

    public String getPassword() {
        return password;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    
    public void setPassword(String password) {
        this.password = password;
    }
}
