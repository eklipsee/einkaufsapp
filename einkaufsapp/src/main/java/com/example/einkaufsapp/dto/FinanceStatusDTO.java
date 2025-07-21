package com.example.einkaufsapp.dto;

public class FinanceStatusDTO {
    private Long id;
    private String partnerUsername;
    private double balance;

    public FinanceStatusDTO(Long id, String partnerUsername, double balance) {
        this.id = id;
        this.partnerUsername = partnerUsername;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public String getPartnerUsername() {
        return partnerUsername;
    }

    public double getBalance() {
        return balance;
    }
}