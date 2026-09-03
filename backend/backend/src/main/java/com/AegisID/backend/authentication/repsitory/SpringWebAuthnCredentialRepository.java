package com.AegisID.backend.authentication.repsitory;

import com.AegisID.backend.authentication.entity.WebAuthnCredential;
import com.AegisID.backend.user.entity.User;
import com.AegisID.backend.user.repository.UserRepository;

import org.springframework.security.web.webauthn.api.AuthenticatorTransport;
import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.security.web.webauthn.api.CredentialRecord;
import org.springframework.security.web.webauthn.api.ImmutableCredentialRecord;
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCose;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialType;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.stereotype.Repository;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Repository
public class SpringWebAuthnCredentialRepository
        implements UserCredentialRepository {

    private final WebAuthnCredentialRepository credentialRepository;
    private final UserRepository userRepository;

    public SpringWebAuthnCredentialRepository(
            WebAuthnCredentialRepository credentialRepository,
            UserRepository userRepository) {

        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
    }

    // ============================================================
    // FIND BY CREDENTIAL ID
    // ============================================================

    @Override
    public CredentialRecord findByCredentialId(Bytes credentialId) {

        String credentialIdString =
                credentialId.toBase64UrlString();

        return credentialRepository
                .findByCredentialId(credentialIdString)
                .map(this::convert)
                .orElse(null);
    }

    // ============================================================
    // FIND BY USER ID
    // ============================================================

    @Override
    public List<CredentialRecord> findByUserId(Bytes userId) {

        /*
         * Spring WebAuthn userId is our opaque WebAuthn
         * user handle, NOT users.id.
         */
        String webauthnUserHandle = new String(
                userId.getBytes(),
                StandardCharsets.UTF_8
        );

        User user = userRepository
                .findByWebauthnUserHandle(webauthnUserHandle)
                .orElse(null);

        if (user == null) {
            return List.of();
        }

        /*
         * Spring Security requires List<CredentialRecord>.
         */
        return credentialRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::convert)
                .toList();
    }

    // ============================================================
    // SAVE
    // ============================================================

    @Override
    public void save(CredentialRecord record) {

        /*
         * Convert WebAuthn user handle to String.
         */
        String webauthnUserHandle = new String(
                record.getUserEntityUserId().getBytes(),
                StandardCharsets.UTF_8
        );

        /*
         * Find the real database user.
         */
        User user = userRepository
                .findByWebauthnUserHandle(webauthnUserHandle)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User not found for WebAuthn user handle"
                        )
                );

        /*
         * Credential ID.
         */
        String credentialId =
                record.getCredentialId()
                        .toBase64UrlString();

        /*
         * Public key.
         */
        String publicKey =
                java.util.Base64
                        .getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(
                                record.getPublicKey().getBytes()
                        );

        /*
         * Find existing credential or create new one.
         */
        WebAuthnCredential entity =
                credentialRepository
                        .findByCredentialId(credentialId)
                        .orElseGet(
                                WebAuthnCredential::new
                        );

        entity.setUserId(user.getId());

        entity.setCredentialId(credentialId);

        entity.setPublicKey(publicKey);

        entity.setSignCount(
                record.getSignatureCount()
        );

        entity.setUvInitialized(
                record.isUvInitialized()
        );

        entity.setBackupEligible(
                record.isBackupEligible()
        );

        entity.setBackupState(
                record.isBackupState()
        );

        // ========================================================
        // CREDENTIAL TYPE
        // ========================================================

        if (record.getCredentialType() != null) {

            entity.setCredentialType(
                    record.getCredentialType()
                            .getValue()
            );
        }

        // ========================================================
        // TRANSPORTS
        // ========================================================

        if (record.getTransports() != null) {

            String transports =
                    record.getTransports()
                            .stream()
                            .map(
                                    AuthenticatorTransport::getValue
                            )
                            .reduce(
                                    (a, b) -> a + "," + b
                            )
                            .orElse("");

            entity.setTransports(transports);
        }

        // ========================================================
        // LABEL
        // ========================================================

        entity.setLabel(record.getLabel());

        // ========================================================
        // CREATED
        // ========================================================

        if (record.getCreated() != null) {

            entity.setCreatedAt(
                    LocalDateTime.ofInstant(
                            record.getCreated(),
                            ZoneOffset.UTC
                    )
            );
        }

        // ========================================================
        // LAST USED
        // ========================================================

        if (record.getLastUsed() != null) {

            entity.setLastUsedAt(
                    LocalDateTime.ofInstant(
                            record.getLastUsed(),
                            ZoneOffset.UTC
                    )
            );
        }

        // ========================================================
        // ATTESTATION OBJECT
        // ========================================================

        if (record.getAttestationObject() != null) {

            entity.setAttestationObject(
                    record.getAttestationObject()
                            .toBase64UrlString()
            );
        }

        // ========================================================
        // ATTESTATION CLIENT DATA JSON
        // ========================================================

        if (record.getAttestationClientDataJSON() != null) {

            entity.setAttestationClientDataJson(
                    record.getAttestationClientDataJSON()
                            .toBase64UrlString()
            );
        }

        credentialRepository.save(entity);
    }

    // ============================================================
    // DELETE
    // ============================================================

    @Override
    public void delete(Bytes credentialId) {

        String credentialIdString =
                credentialId.toBase64UrlString();

        credentialRepository.deleteByCredentialId(
                credentialIdString
        );
    }

    // ============================================================
    // DATABASE ENTITY → SPRING WEBAUTHN RECORD
    // ============================================================

    private CredentialRecord convert(
            WebAuthnCredential entity) {

        /*
         * Find the database user.
         */
        User user = userRepository
                .findById(entity.getUserId())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User not found for WebAuthn credential"
                        )
                );

        /*
         * WebAuthn user handle.
         */
        Bytes userHandle = new Bytes(
                user.getWebauthnUserHandle()
                        .getBytes(StandardCharsets.UTF_8)
        );

        /*
         * Credential ID.
         */
        Bytes credentialId =
                Bytes.fromBase64(
                        entity.getCredentialId()
                );

        /*
         * Public key.
         */
        ImmutablePublicKeyCose publicKey =
                ImmutablePublicKeyCose.fromBase64(
                        entity.getPublicKey()
                );

        /*
         * Build Spring Security CredentialRecord.
         */
        ImmutableCredentialRecord.ImmutableCredentialRecordBuilder builder =
                ImmutableCredentialRecord.builder()
                        .credentialId(credentialId)
                        .userEntityUserId(userHandle)
                        .publicKey(publicKey)
                        .signatureCount(
                                entity.getSignCount()
                        )
                        .uvInitialized(
                                entity.isUvInitialized()
                        )
                        .backupEligible(
                                entity.isBackupEligible()
                        )
                        .backupState(
                                entity.isBackupState()
                        );

        // ========================================================
        // CREDENTIAL TYPE
        // ========================================================

        if (entity.getCredentialType() != null) {

            builder.credentialType(
                    PublicKeyCredentialType.valueOf(
                            entity.getCredentialType()
                    )
            );
        }

        // ========================================================
        // LABEL
        // ========================================================

        if (entity.getLabel() != null) {

            builder.label(entity.getLabel());

        } else {

            builder.label("Passkey");
        }

        // ========================================================
        // TRANSPORTS
        // ========================================================

        if (entity.getTransports() != null
                && !entity.getTransports().isBlank()) {

            Set<AuthenticatorTransport> transports =
                    new HashSet<>();

            for (String value :
                    entity.getTransports().split(",")) {

                String transport = value.trim();

                if (!transport.isEmpty()) {

                    transports.add(
                            AuthenticatorTransport.valueOf(
                                    transport
                            )
                    );
                }
            }

            builder.transports(transports);
        }

        // ========================================================
        // CREATED
        // ========================================================

        if (entity.getCreatedAt() != null) {

            builder.created(
                    entity.getCreatedAt()
                            .toInstant(ZoneOffset.UTC)
            );
        }

        // ========================================================
        // LAST USED
        // ========================================================

        if (entity.getLastUsedAt() != null) {

            builder.lastUsed(
                    entity.getLastUsedAt()
                            .toInstant(ZoneOffset.UTC)
            );
        }

        // ========================================================
        // ATTESTATION OBJECT
        // ========================================================

        if (entity.getAttestationObject() != null
                && !entity.getAttestationObject().isBlank()) {

            builder.attestationObject(
                    Bytes.fromBase64(
                            entity.getAttestationObject()
                    )
            );
        }

        // ========================================================
        // ATTESTATION CLIENT DATA JSON
        // ========================================================

        if (entity.getAttestationClientDataJson() != null
                && !entity.getAttestationClientDataJson().isBlank()) {

            builder.attestationClientDataJSON(
                    Bytes.fromBase64(
                            entity.getAttestationClientDataJson()
                    )
            );
        }

        // ========================================================
        // BUILD
        // ========================================================

        return builder.build();
    }
}