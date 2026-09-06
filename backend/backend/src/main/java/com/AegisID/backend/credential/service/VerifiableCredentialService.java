package com.AegisID.backend.credential.service;

import com.AegisID.backend.credential.entity.VerifiableCredential;
import com.AegisID.backend.credential.repository.VerifiableCredentialRepository;
import com.AegisID.backend.credential.util.CredentialHashUtil;
import com.AegisID.backend.identity.entity.Identity;
import com.AegisID.backend.identity.repository.IdentityRepository;
import com.AegisID.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VerifiableCredentialService {

    private final VerifiableCredentialRepository credentialRepository;
    private final IdentityRepository identityRepository;
    private final UserRepository userRepository;


    // =========================
    // CONSTRUCTOR
    // =========================

    public VerifiableCredentialService(
            VerifiableCredentialRepository credentialRepository,
            IdentityRepository identityRepository,
            UserRepository userRepository) {

        this.credentialRepository = credentialRepository;
        this.identityRepository = identityRepository;
        this.userRepository = userRepository;
    }


    // =========================
    // GET ALL CREDENTIALS
    // =========================

    public List<VerifiableCredential> getAllCredentials() {

        return credentialRepository.findAll();
    }


    // =========================
    // GET CREDENTIAL BY ID
    // =========================

    public VerifiableCredential getCredentialById(Long id) {

        return credentialRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Credential not found with id: " + id));
    }


    // =========================
    // GET BY IDENTITY
    // =========================

    public List<VerifiableCredential> getCredentialsByIdentityId(
            Long identityId) {

        return credentialRepository.findByIdentityId(identityId);
    }


    // =========================
    // GET BY ISSUER
    // =========================

    public List<VerifiableCredential> getCredentialsByIssuerId(
            Long issuerId) {

        return credentialRepository.findByIssuerId(issuerId);
    }


    // =========================
    // GET BY HASH
    // =========================

    public VerifiableCredential getCredentialByHash(
            String credentialHash) {

        return credentialRepository
                .findByCredentialHash(credentialHash)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Credential not found with hash: "
                                        + credentialHash));
    }


    // =========================
    // TRUNCATE TO MICROSECONDS
    // =========================

    private LocalDateTime truncateToMicros(
            LocalDateTime dateTime) {

        if (dateTime == null) {
            return null;
        }

        return dateTime.withNano(
                (dateTime.getNano() / 1000) * 1000
        );
    }


    // =========================
    // CANONICAL DATA
    // =========================

    private String buildCanonicalData(
            VerifiableCredential credential) {

        return String.valueOf(
                credential.getCredentialType())
                + "|"
                + String.valueOf(
                credential.getIdentityId())
                + "|"
                + String.valueOf(
                credential.getIssuerId())
                + "|"
                + String.valueOf(
                credential.getCredentialSubject())
                + "|"
                + String.valueOf(
                truncateToMicros(
                        credential.getIssuedAt()))
                + "|"
                + String.valueOf(
                truncateToMicros(
                        credential.getExpiresAt()));
    }


    // =========================
    // CREATE CREDENTIAL
    // =========================

    public VerifiableCredential createCredential(
            VerifiableCredential credential) {

        /*
         * Make sure issuedAt exists before hashing.
         */
        if (credential.getIssuedAt() == null) {

            credential.setIssuedAt(
                    LocalDateTime.now());
        }


        /*
         * Normalize issuedAt to MySQL
         * TIMESTAMP(6) precision.
         */
        credential.setIssuedAt(
                truncateToMicros(
                        credential.getIssuedAt())
        );


        /*
         * Normalize expiresAt if provided.
         */
        if (credential.getExpiresAt() != null) {

            credential.setExpiresAt(
                    truncateToMicros(
                            credential.getExpiresAt())
            );
        }


        /*
         * Newly created credentials are
         * always ACTIVE.
         */
        credential.setStatus(
                VerifiableCredential.CredentialStatus.ACTIVE);


        /*
         * Build canonical credential data.
         */
        String canonicalData =
                buildCanonicalData(credential);


        /*
         * Generate SHA-256 hash.
         */
        String generatedHash =
                CredentialHashUtil.sha256(
                        canonicalData);


        /*
         * Ignore any client supplied hash.
         */
        credential.setCredentialHash(
                generatedHash);


        /*
         * Prevent duplicate credentials.
         */
        if (credentialRepository.existsByCredentialHash(
                generatedHash)) {

            throw new RuntimeException(
                    "Credential already exists");
        }


        return credentialRepository.save(credential);
    }


    // =========================
    // VERIFY CREDENTIAL
    // =========================

    public boolean verifyCredential(Long id) {

        VerifiableCredential credential =
                getCredentialById(id);


        /*
         * Rebuild the exact same canonical
         * representation used during creation.
         */
        String canonicalData =
                buildCanonicalData(credential);


        /*
         * Generate the hash again.
         */
        String recalculatedHash =
                CredentialHashUtil.sha256(
                        canonicalData);


        /*
         * Compare recalculated hash with
         * database hash.
         */
        return recalculatedHash.equals(
                credential.getCredentialHash());
    }


    // =========================
    // VALIDATE CREDENTIAL
    // =========================

    public boolean validateCredential(Long id) {

        VerifiableCredential credential =
                getCredentialById(id);


        /*
         * 1. Credential must be ACTIVE.
         */
        if (credential.getStatus()
                != VerifiableCredential.CredentialStatus.ACTIVE) {

            return false;
        }


        /*
         * 2. Identity must exist.
         */
        Identity identity =
                identityRepository.findById(
                                credential.getIdentityId())
                        .orElse(null);

        if (identity == null) {
            return false;
        }


        /*
         * 3. Identity must be ACTIVE.
         */
        if (identity.getIdentityStatus()
                != Identity.IdentityStatus.ACTIVE) {

            return false;
        }


        /*
         * 4. Issuer must exist.
         */
        if (!userRepository.existsById(
                credential.getIssuerId())) {

            return false;
        }


        /*
         * 5. Credential hash must be valid.
         */
        if (!verifyCredential(id)) {
            return false;
        }


        /*
         * 6. Check credential expiration.
         */
        if (credential.getExpiresAt() != null
                && credential.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            return false;
        }


        /*
         * All validation checks passed.
         */
        return true;
    }


    // =========================
    // REVOKE CREDENTIAL
    // =========================

    public VerifiableCredential revokeCredential(Long id) {

        VerifiableCredential credential =
                getCredentialById(id);

        credential.setStatus(
                VerifiableCredential.CredentialStatus.REVOKED);

        return credentialRepository.save(credential);
    }


    // =========================
    // REACTIVATE CREDENTIAL
    // =========================

    public VerifiableCredential reactivateCredential(Long id) {

        VerifiableCredential credential =
                getCredentialById(id);

        credential.setStatus(
                VerifiableCredential.CredentialStatus.ACTIVE);

        return credentialRepository.save(credential);
    }


    // =========================
    // EXPIRE CREDENTIAL
    // =========================

    public VerifiableCredential expireCredential(Long id) {

        VerifiableCredential credential =
                getCredentialById(id);

        credential.setStatus(
                VerifiableCredential.CredentialStatus.EXPIRED);

        return credentialRepository.save(credential);
    }


    // =========================
    // GET BY STATUS
    // =========================

    public List<VerifiableCredential> getCredentialsByStatus(
            VerifiableCredential.CredentialStatus status) {

        return credentialRepository.findByStatus(status);
    }
}