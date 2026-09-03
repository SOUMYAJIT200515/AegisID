package com.AegisID.backend.authentication.controller;

import com.AegisID.backend.authentication.dto.LoginRequest;
import com.AegisID.backend.authentication.dto.LoginResponse;
import com.AegisID.backend.authentication.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest loginRequest) {

        LoginResponse response =
                authenticationService.login(loginRequest);

        return ResponseEntity.ok(response);
    }
}

