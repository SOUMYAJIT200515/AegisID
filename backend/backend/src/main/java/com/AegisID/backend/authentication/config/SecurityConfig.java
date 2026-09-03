package com.AegisID.backend.authentication.config;

import com.AegisID.backend.authentication.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter)
            throws Exception {

        http
                // CSRF is ignored for our REST API
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**")
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // PUBLIC ENDPOINTS
                        // =========================

                        .requestMatchers("/api/health")
                        .permitAll()

                        .requestMatchers("/api/auth/login")
                        .permitAll()

                        .requestMatchers("/api/auth/dev-login")
                        .permitAll()

                        .requestMatchers("/csrf")
                        .permitAll()


                        // =========================
                        // WEBAUTHN
                        // =========================

                        .requestMatchers("/webauthn/**")
                        .permitAll()

                        .requestMatchers("/login/webauthn")
                        .permitAll()


                        // =========================
                        // USER APIs
                        // =========================

                        // GET /api/users
                        // GET /api/users/{id}
                        //
                        // Requires USER_READ permission
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/**"
                        )
                        .hasAuthority("USER_READ")

// POST /api/users
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/users"
                                )
                                .hasAuthority("USER_CREATE")

// PUT /api/users/{id}
                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/api/users/**"
                                )
                                .hasAuthority("USER_UPDATE")
                                // DELETE /api/users/{id}
                                .requestMatchers(
                                        HttpMethod.DELETE,
                                        "/api/users/**"
                                )
                                .hasAuthority("USER_SUSPEND")


                        // =========================
                        // EVERYTHING ELSE
                        // =========================

                        .anyRequest()
                        .authenticated()
                )

                // =========================
                // JWT FILTER
                // =========================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                // =========================
                // WEBAUTHN CONFIGURATION
                // =========================

                .webAuthn(webAuthn -> webAuthn
                        .rpName("AegisID")
                        .rpId("localhost")
                        .allowedOrigins(
                                "http://localhost:8080"
                        )
                );

        return http.build();
    }
}