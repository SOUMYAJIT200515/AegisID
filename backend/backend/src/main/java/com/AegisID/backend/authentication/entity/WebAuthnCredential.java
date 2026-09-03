package com.AegisID.backend.authentication.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "webauthn_credentials")
public class WebAuthnCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "credential_id", nullable = false, unique = true, length = 500)
    private String credentialId;

    @Lob
    @Column(name = "public_key", nullable = false)
    private String publicKey;

    @Column(name = "sign_count", nullable = false)
    private Long signCount = 0L;

    @Column(name = "aaguid", length = 100)
    private String aaguid;

    @Column(name = "device_name", length = 150)
    private String deviceName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @Column(name = "credential_type", length = 50)
    private String credentialType;

    @Column(name = "transports", length = 255)
    private String transports;

    @Column(name = "uv_initialized", nullable = false)
    private boolean uvInitialized = false;

    @Column(name = "backup_eligible", nullable = false)
    private boolean backupEligible = false;

    @Column(name = "backup_state", nullable = false)
    private boolean backupState = false;

    @Column(name = "label", length = 150)
    private String label;

    @Lob
    @Column(name = "attestation_object")
    private String attestationObject;

    @Lob
    @Column(name = "attestation_client_data_json")
    private String attestationClientDataJson;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (signCount == null) {
            signCount = 0L;
        }
    }

    public WebAuthnCredential() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public Long getSignCount() {
        return signCount;
    }

    public void setSignCount(Long signCount) {
        this.signCount = signCount;
    }

    public String getAaguid() {
        return aaguid;
    }

    public void setAaguid(String aaguid) {
        this.aaguid = aaguid;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastUsedAt() {
        return lastUsedAt;
    }

    public void setLastUsedAt(LocalDateTime lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }

    public String getCredentialType() {
        return credentialType;
    }

    public void setCredentialType(String credentialType) {
        this.credentialType = credentialType;
    }

    public String getTransports() {
        return transports;
    }

    public void setTransports(String transports) {
        this.transports = transports;
    }

    public boolean isUvInitialized() {
        return uvInitialized;
    }

    public void setUvInitialized(boolean uvInitialized) {
        this.uvInitialized = uvInitialized;
    }

    public boolean isBackupEligible() {
        return backupEligible;
    }

    public void setBackupEligible(boolean backupEligible) {
        this.backupEligible = backupEligible;
    }

    public boolean isBackupState() {
        return backupState;
    }

    public void setBackupState(boolean backupState) {
        this.backupState = backupState;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getAttestationObject() {
        return attestationObject;
    }

    public void setAttestationObject(String attestationObject) {
        this.attestationObject = attestationObject;
    }

    public String getAttestationClientDataJson() {
        return attestationClientDataJson;
    }

    public void setAttestationClientDataJson(String attestationClientDataJson) {
        this.attestationClientDataJson = attestationClientDataJson;
    }
}