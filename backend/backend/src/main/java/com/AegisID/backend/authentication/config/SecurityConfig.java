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
                // REST API uses JWT authentication,
                // so CSRF protection is disabled.

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

                        // -------------------------
                        // Blockchain status
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/blockchain/status"
                        )
                        .permitAll()


                        // -------------------------
                        // Blockchain contract info
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/blockchain/contract"
                        )
                        .permitAll()


                        // -------------------------
                        // Read blockchain identity
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/blockchain/identity/**"
                        )
                        .permitAll()


                        // -------------------------
                        // Anchor identity
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/blockchain/identity/anchor"
                        )
                        .permitAll()


                        // -------------------------
                        // Generate identity hash
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/identities/*/hash"
                        )
                        .permitAll()


                        // -------------------------
                        // Anchor credential
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/blockchain/credential/anchor"
                        )
                        .permitAll()


                        // -------------------------
                        // Read blockchain credential
                        // -------------------------

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

                        // Verify / validate credential
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/credentials/*/verify",
                                "/api/credentials/*/validate"
                        )
                        .hasAuthority("CREDENTIAL_VERIFY")


                        // Read credentials
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/credentials/**"
                        )
                        .hasAuthority("CREDENTIAL_READ")


                        // Create credential
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/credentials"
                        )
                        .hasAuthority("CREDENTIAL_CREATE")


                        // Revoke credential
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/credentials/*/revoke"
                        )
                        .hasAuthority("CREDENTIAL_REVOKE")


                        // Reactivate credential
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/credentials/*/reactivate"
                        )
                        .hasAuthority("CREDENTIAL_UPDATE")


                        // Expire credential
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