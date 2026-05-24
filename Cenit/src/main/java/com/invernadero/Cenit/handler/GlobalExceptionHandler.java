package com.invernadero.cenit.handler;

import com.invernadero.cenit.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage() != null ? ex.getMessage() : "Error interno";
        String prefix = message.contains(":") ? message.substring(0, message.indexOf(":")) : "";
        String body = message.contains(":") ? message.substring(message.indexOf(":") + 1) : message;

        HttpStatus status = switch (prefix) {
            case "EMAIL_NOT_FOUND"     -> HttpStatus.UNAUTHORIZED;
            case "INVALID_CREDENTIALS" -> HttpStatus.UNAUTHORIZED;
            case "USER_INACTIVE"       -> HttpStatus.FORBIDDEN;
            case "OTP_INVALID"         -> HttpStatus.BAD_REQUEST;
            case "WRONG_PASSWORD"      -> HttpStatus.UNAUTHORIZED;
            case "NOT_FOUND"           -> HttpStatus.NOT_FOUND;
            case "DUPLICATE_EMAIL"     -> HttpStatus.CONFLICT;
            default                    -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        return ResponseEntity.status(status).body(
                new ErrorResponse(status.value(), status.getReasonPhrase(), body)
        );
    }
}

