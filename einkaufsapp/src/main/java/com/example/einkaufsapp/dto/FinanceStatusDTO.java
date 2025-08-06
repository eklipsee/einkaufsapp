package com.example.einkaufsapp.dto;

public class FinanceStatusDTO {
    private Long id;
    private String partnerUsername;
    private double balance;
    private String creditorName; // Wer hat mehr bezahlt
    private double absoluteBalance; // Immer positiver Betrag

    public FinanceStatusDTO(Long id, String partnerUsername, double balance, String creditorName) {
        this.id = id;
        this.partnerUsername = partnerUsername;
        this.balance = balance;
        this.creditorName = creditorName;
        this.absoluteBalance = Math.abs(balance);
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getPartnerUsername() {
        return partnerUsername;
    }

    public double getBalance() {
        return balance;
    }

    public String getCreditorName() {
        return creditorName;
    }

    public double getAbsoluteBalance() {
        return absoluteBalance;
    }
}