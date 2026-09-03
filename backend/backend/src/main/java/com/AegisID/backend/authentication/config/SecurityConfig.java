package com.AegisID.backend.authentication.config;

import com.AegisID.backend.authentication.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    // =========================
    // PASSWORD ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // =========================
    // AUTHENTICATION MANAGER
    // =========================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // =========================
    // SECURITY FILTER CHAIN
    // =========================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter)
            throws Exception {

        http

                // =========================
                // CSRF
                // =========================

                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**")
                )


                // =========================
                // AUTHORIZATION
                // =========================

                .authorizeHttpRequests(auth -> auth


                        // =========================
                        // PUBLIC ENDPOINTS
                        // =========================

                        .requestMatchers("/api/health")
                        .permitAll()

                        // Blockchain connectivity/health test
                        .requestMatchers("/api/blockchain/status",
                                "/api/blockchain/contract",
                                "/api/blockchain/identity/**",
                                "/api/blockchain/identity/anchor")
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

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/**"
                        )
                        .hasAuthority("USER_READ")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/users"
                        )
                        .hasAuthority("USER_CREATE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/users/**"
                        )
                        .hasAuthority("USER_UPDATE")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/users/**"
                        )
                        .hasAuthority("USER_SUSPEND")


                        // =========================
                        // IDENTITY APIs
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/identities/**"
                        )
                        .hasAuthority("IDENTITY_READ")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/identities"
                        )
                        .hasAuthority("IDENTITY_CREATE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/identities/*/wallet"
                        )
                        .hasAuthority("IDENTITY_UPDATE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/identities/*/verify"
                        )
                        .hasAuthority("IDENTITY_VERIFY")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/identities/*/reject"
                        )
                        .hasAuthority("IDENTITY_VERIFY")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/identities/*/suspend"
                        )
                        .hasAuthority("IDENTITY_SUSPEND")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/identities/*/revoke"
                        )
                        .hasAuthority("IDENTITY_REVOKE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/identities/*/reactivate"
                        )
                        .hasAuthority("IDENTITY_UPDATE")


                        // =========================
                        // CREDENTIAL APIs
                        // =========================

                        // VERIFY + VALIDATE
                        // These MUST come before
                        // the general GET credential rule.

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/credentials/*/verify",
                                "/api/credentials/*/validate"
                        )
                        .hasAuthority("CREDENTIAL_VERIFY")


                        // GENERAL CREDENTIAL GET

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/credentials/**"
                        )
                        .hasAuthority("CREDENTIAL_READ")


                        // CREATE CREDENTIAL

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/credentials"
                        )
                        .hasAuthority("CREDENTIAL_CREATE")


                        // REVOKE CREDENTIAL

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/credentials/*/revoke"
                        )
                        .hasAuthority("CREDENTIAL_REVOKE")


                        // REACTIVATE CREDENTIAL

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/credentials/*/reactivate"
                        )
                        .hasAuthority("CREDENTIAL_UPDATE")


                        // EXPIRE CREDENTIAL

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/credentials/*/expire"
                        )
                        .hasAuthority("CREDENTIAL_UPDATE")


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