package com.AegisID.backend.authentication.repsitory;

import com.AegisID.backend.authentication.entity.WebAuthnCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WebAuthnCredentialRepository
        extends JpaRepository<WebAuthnCredential, Long> {

    Optional<WebAuthnCredential> findByCredentialId(String credentialId);

    List<WebAuthnCredential> findByUserId(Long userId);

    boolean existsByCredentialId(String credentialId);

    void deleteByCredentialId(String credentialId);
}