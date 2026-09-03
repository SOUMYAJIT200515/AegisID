package com.AegisID.backend.authentication.controller;

import com.AegisID.backend.user.entity.User;
import com.AegisID.backend.user.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class DevAuthController {

    private final UserRepository userRepository;

    public DevAuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/dev-login")
    public Map<String, Object> devLogin(
            @RequestParam String username,
            HttpServletRequest request) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User is not active");
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        null,
                        java.util.List.of()
                );

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);

        request.getSession(true).setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                context
        );

        return Map.of(
                "success", true,
                "message", "Development login successful",
                "userId", user.getId(),
                "username", user.getUsername()
        );
    }
}