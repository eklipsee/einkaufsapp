package com.example.einkaufsapp.repository;

import com.example.einkaufsapp.model.FinanceStatus;
import com.example.einkaufsapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FinanceStatusRepository extends JpaRepository<FinanceStatus, Long> {
    boolean existsByUserAAndUserB(User userA, User userB);
    boolean existsByUserBAndUserA(User userA, User userB);
    List<FinanceStatus> findByUserAOrUserB(User userA, User userB);
}