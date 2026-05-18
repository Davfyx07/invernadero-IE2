package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.OtpToken;
import com.invernadero.cenit.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;

    private final Random random = new Random();

    public String generateCode() {
        return String.format("%06d", random.nextInt(999999));
    }

    public OtpToken createOtp(String email, String type) {
        String code = generateCode();
        OtpToken token = OtpToken.builder()
                .email(email)
                .code(code)
                .type(type)
                .expiry(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();
        return otpTokenRepository.save(token);
    }

    public boolean verifyOtp(String email, String code, String type) {
        Optional<OtpToken> opt = otpTokenRepository
                .findTopByEmailAndTypeAndUsedFalseOrderByCreatedAtDesc(email, type);
        if (opt.isEmpty()) return false;
        OtpToken token = opt.get();
        if (token.getExpiry().isBefore(LocalDateTime.now())) return false;
        if (!token.getCode().equals(code)) return false;
        token.setUsed(true);
        otpTokenRepository.save(token);
        return true;
    }

    public void sendOtp(String email, String type, String purposeLabel) {
        OtpToken token = createOtp(email, type);
        emailService.sendOtp(email, token.getCode(), purposeLabel);
    }
}
