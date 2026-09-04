package com.AegisID.backend.authentication.config;

import com.AegisID.backend.authentication.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

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

                .csrf(csrf -> csrf.disable())

                // =========================
                // AUTHORIZATION
                // =========================

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // PUBLIC ENDPOINTS
                        // =========================

                        .requestMatchers(
                                "/api/health"
                        )
                        .permitAll()

                        // =========================
                        // AUTHENTICATION
                        // =========================

                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/dev-login"
                        )
                        .permitAll()

                        // =========================
                        // WEBAUTHN
                        // =========================

                        .requestMatchers(
                                "/webauthn/**",
                                "/login/webauthn"
                        )
                        .permitAll()

                        // =========================
                        // CSRF ENDPOINT
                        // =========================

                        .requestMatchers(
                                "/csrf"
                        )
                        .permitAll()

                        // =========================
                        // BLOCKCHAIN
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/blockchain/status"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/blockchain/contract"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/blockchain/identity/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/blockchain/identity/anchor"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/identities/*/hash"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/blockchain/credential/anchor"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/blockchain/credential/**"
                        )
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

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/credentials/*/verify",
                                "/api/credentials/*/validate"
                        )
                        .hasAuthority("CREDENTIAL_VERIFY")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/credentials/**"
                        )
                        .hasAuthority("CREDENTIAL_READ")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/credentials"
                        )
                        .hasAuthority("CREDENTIAL_CREATE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/credentials/*/revoke"
                        )
                        .hasAuthority("CREDENTIAL_REVOKE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/credentials/*/reactivate"
                        )
                        .hasAuthority("CREDENTIAL_UPDATE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/credentials/*/expire"
                        )
                        .hasAuthority("CREDENTIAL_UPDATE")

                        // =========================
                        // DIGITAL ASSET APIs
                        // =========================

                        // Verify asset hash
                        // IMPORTANT: must come BEFORE
                        // the general GET /api/assets/** rule.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/assets/*/verify"
                        )
                        .hasAuthority("ASSET_VERIFY")

                        // Read assets
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/assets",
                                "/api/assets/**"
                        )
                        .hasAuthority("ASSET_READ")

                        // Create asset
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/assets"
                        )
                        .hasAuthority("ASSET_CREATE")

                        // Update asset
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/assets/*"
                        )
                        .hasAuthority("ASSET_UPDATE")

                        // Assign asset
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/assets/*/assign"
                        )
                        .hasAuthority("ASSET_ASSIGN")

                        // Transfer asset
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/assets/*/transfer"
                        )
                        .hasAuthority("ASSET_TRANSFER")

                        // Revoke asset
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/assets/*/revoke"
                        )
                        .hasAuthority("ASSET_REVOKE")

                        // Restore asset
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/assets/*/restore"
                        )
                        .hasAuthority("ASSET_UPDATE")

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
