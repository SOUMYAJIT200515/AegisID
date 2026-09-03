package com.AegisID.backend.credential.repository;

import com.AegisID.backend.credential.entity.VerifiableCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VerifiableCredentialRepository
        extends JpaRepository<VerifiableCredential, Long> {

    List<VerifiableCredential> findByIdentityId(Long identityId);

    List<VerifiableCredential> findByIssuerId(Long issuerId);

    Optional<VerifiableCredential> findByCredentialHash(
            String credentialHash);

    boolean existsByCredentialHash(String credentialHash);

    List<VerifiableCredential> findByStatus(
            VerifiableCredential.CredentialStatus status);
}