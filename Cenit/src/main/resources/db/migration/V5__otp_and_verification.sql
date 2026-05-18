-- V5: OTP tokens table + usuario fields for email verification and first login
CREATE TABLE IF NOT EXISTS otp_tokens (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    code VARCHAR(6) NOT NULL,
    type VARCHAR(30) NOT NULL,
    expiry TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL
);

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS first_login BOOLEAN DEFAULT true;

-- Marcar usuarios existentes como verificados y no first_login
UPDATE usuarios SET email_verified = true, first_login = false;
