package com.AegisID.backend.authentication.config;

import com.AegisID.backend.authentication.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter)
            throws Exception {

        http
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**")
                )

                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers("/api/health")
                        .permitAll()

                        .requestMatchers("/api/auth/login")
                        .permitAll()

                        .requestMatchers("/api/auth/dev-login")
                        .permitAll()

                        .requestMatchers("/csrf")
                        .permitAll()

                        // WebAuthn endpoints
                        .requestMatchers("/webauthn/**")
                        .permitAll()

                        .requestMatchers("/login/webauthn")
                        .permitAll()

                        // Temporary: user APIs are still public
                        // We will secure these properly in Phase 5.4
                        .requestMatchers("/api/users/**")
                        .permitAll()

                        // Everything else requires authentication
                        .anyRequest()
                        .authenticated()
                )

                // JWT authentication filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                // WebAuthn configuration
                .webAuthn(webAuthn -> webAuthn
                        .rpName("AegisID")
                        .rpId("localhost")
                        .allowedOrigins("http://localhost:8080")
                );

        return http.build();
    }
}

