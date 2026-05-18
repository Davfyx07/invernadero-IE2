package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    Optional<OtpToken> findTopByEmailAndTypeAndUsedFalseOrderByCreatedAtDesc(String email, String type);
}
