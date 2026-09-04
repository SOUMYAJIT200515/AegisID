package com.AegisID.backend.asset.service;

import com.AegisID.backend.asset.entity.DigitalAsset;
import com.AegisID.backend.asset.repsitory.DigitalAssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DigitalAssetService {

    private final DigitalAssetRepository assetRepository;

    public DigitalAssetService(
            DigitalAssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    // =========================================================
    // CREATE ASSET
    // =========================================================

    public DigitalAsset createAsset(
            String assetName,
            String assetType,
            String description,
            Long ownerId) {

        validateAssetName(assetName);
        validateAssetType(assetType);
        validateOwnerId(ownerId);

        DigitalAsset asset = new DigitalAsset();

        asset.setAssetName(assetName.trim());
        asset.setAssetType(assetType.trim());

        if (description != null) {
            asset.setDescription(description.trim());
        }

        asset.setOwnerId(ownerId);

        /*
         * Generate deterministic SHA-256 hash from the
         * important asset information.
         */
        String assetHash = generateAssetHash(
                assetName,
                assetType,
                description,
                ownerId
        );

        // Prevent accidental duplicate asset hash
        if (assetRepository.existsByAssetHash(assetHash)) {
            throw new IllegalStateException(
                    "Asset with the same data already exists"
            );
        }

        asset.setAssetHash(assetHash);
        asset.setStatus(DigitalAsset.AssetStatus.ACTIVE);

        return assetRepository.save(asset);
    }

    // =========================================================
    // GET ALL ASSETS
    // =========================================================

    @Transactional(readOnly = true)
    public List<DigitalAsset> getAllAssets() {
        return assetRepository.findAll();
    }

    // =========================================================
    // GET ASSET BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public DigitalAsset getAssetById(Long id) {

        return assetRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Digital asset not found with id: " + id
                        )
                );
    }

    // =========================================================
    // GET ASSET BY HASH
    // =========================================================

    @Transactional(readOnly = true)
    public DigitalAsset getAssetByHash(String assetHash) {

        if (assetHash == null || assetHash.isBlank()) {
            throw new IllegalArgumentException(
                    "Asset hash cannot be empty"
            );
        }

        return assetRepository
                .findByAssetHash(
                        normalizeHash(assetHash)
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Digital asset not found with hash: "
                                        + assetHash
                        )
                );
    }

    // =========================================================
    // GET ASSETS BY OWNER
    // =========================================================

    @Transactional(readOnly = true)
    public List<DigitalAsset> getAssetsByOwner(Long ownerId) {

        validateOwnerId(ownerId);

        return assetRepository.findByOwnerId(ownerId);
    }

    // =========================================================
    // GET ASSETS BY STATUS
    // =========================================================

    @Transactional(readOnly = true)
    public List<DigitalAsset> getAssetsByStatus(
            DigitalAsset.AssetStatus status) {

        if (status == null) {
            throw new IllegalArgumentException(
                    "Asset status cannot be null"
            );
        }

        return assetRepository.findByStatus(status);
    }

    // =========================================================
    // UPDATE ASSET
    // =========================================================

    public DigitalAsset updateAsset(
            Long id,
            String assetName,
            String assetType,
            String description) {

        DigitalAsset asset = getAssetById(id);

        if (asset.getStatus() ==
                DigitalAsset.AssetStatus.REVOKED) {

            throw new IllegalStateException(
                    "Revoked asset cannot be updated"
            );
        }

        validateAssetName(assetName);
        validateAssetType(assetType);

        asset.setAssetName(assetName.trim());
        asset.setAssetType(assetType.trim());

        if (description != null) {
            asset.setDescription(description.trim());
        } else {
            asset.setDescription(null);
        }

        /*
         * Recalculate the hash after modification.
         */
        String newHash = generateAssetHash(
                asset.getAssetName(),
                asset.getAssetType(),
                asset.getDescription(),
                asset.getOwnerId()
        );

        /*
         * Make sure another asset does not already use
         * the new hash.
         */
        if (!newHash.equals(asset.getAssetHash())
                && assetRepository.existsByAssetHash(newHash)) {

            throw new IllegalStateException(
                    "Another asset already contains the same data"
            );
        }

        asset.setAssetHash(newHash);

        return assetRepository.save(asset);
    }

    // =========================================================
    // ASSIGN ASSET
    // =========================================================

    public DigitalAsset assignAsset(
            Long id,
            Long newOwnerId) {

        DigitalAsset asset = getAssetById(id);

        validateOwnerId(newOwnerId);

        if (asset.getStatus() ==
                DigitalAsset.AssetStatus.REVOKED) {

            throw new IllegalStateException(
                    "Revoked asset cannot be assigned"
            );
        }

        asset.setOwnerId(newOwnerId);

        asset.setStatus(
                DigitalAsset.AssetStatus.ACTIVE
        );

        /*
         * Owner is part of the hash, so the hash changes
         * when ownership changes.
         */
        String newHash = generateAssetHash(
                asset.getAssetName(),
                asset.getAssetType(),
                asset.getDescription(),
                asset.getOwnerId()
        );

        if (!newHash.equals(asset.getAssetHash())
                && assetRepository.existsByAssetHash(newHash)) {

            throw new IllegalStateException(
                    "Another asset already contains the same data"
            );
        }

        asset.setAssetHash(newHash);

        return assetRepository.save(asset);
    }

    // =========================================================
    // TRANSFER ASSET
    // =========================================================

    public DigitalAsset transferAsset(
            Long id,
            Long newOwnerId) {

        DigitalAsset asset = getAssetById(id);

        validateOwnerId(newOwnerId);

        if (asset.getStatus() ==
                DigitalAsset.AssetStatus.REVOKED) {

            throw new IllegalStateException(
                    "Revoked asset cannot be transferred"
            );
        }

        if (asset.getOwnerId().equals(newOwnerId)) {

            throw new IllegalArgumentException(
                    "New owner must be different from current owner"
            );
        }

        asset.setOwnerId(newOwnerId);

        asset.setStatus(
                DigitalAsset.AssetStatus.TRANSFERRED
        );

        String newHash = generateAssetHash(
                asset.getAssetName(),
                asset.getAssetType(),
                asset.getDescription(),
                asset.getOwnerId()
        );

        if (!newHash.equals(asset.getAssetHash())
                && assetRepository.existsByAssetHash(newHash)) {

            throw new IllegalStateException(
                    "Another asset already contains the same data"
            );
        }

        asset.setAssetHash(newHash);

        return assetRepository.save(asset);
    }

    // =========================================================
    // REVOKE ASSET
    // =========================================================

    public DigitalAsset revokeAsset(Long id) {

        DigitalAsset asset = getAssetById(id);

        if (asset.getStatus() ==
                DigitalAsset.AssetStatus.REVOKED) {

            throw new IllegalStateException(
                    "Asset is already revoked"
            );
        }

        asset.setStatus(
                DigitalAsset.AssetStatus.REVOKED
        );

        return assetRepository.save(asset);
    }

    // =========================================================
    // RESTORE ASSET
    // =========================================================

    public DigitalAsset restoreAsset(Long id) {

        DigitalAsset asset = getAssetById(id);

        if (asset.getStatus() !=
                DigitalAsset.AssetStatus.REVOKED) {

            throw new IllegalStateException(
                    "Only revoked assets can be restored"
            );
        }

        asset.setStatus(
                DigitalAsset.AssetStatus.ACTIVE
        );

        return assetRepository.save(asset);
    }

    // =========================================================
    // VERIFY DATABASE HASH
    // =========================================================

    @Transactional(readOnly = true)
    public boolean verifyAsset(Long id) {

        DigitalAsset asset = getAssetById(id);

        String calculatedHash = generateAssetHash(
                asset.getAssetName(),
                asset.getAssetType(),
                asset.getDescription(),
                asset.getOwnerId()
        );

        return calculatedHash.equalsIgnoreCase(
                normalizeHash(asset.getAssetHash())
        );
    }

    // =========================================================
    // GENERATE SHA-256 HASH
    // =========================================================

    private String generateAssetHash(
            String assetName,
            String assetType,
            String description,
            Long ownerId) {

        String canonicalData =
                normalizeString(assetName)
                        + "|"
                        + normalizeString(assetType)
                        + "|"
                        + normalizeString(description)
                        + "|"
                        + ownerId;

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            canonicalData.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            StringBuilder hex =
                    new StringBuilder();

            for (byte b : hash) {
                hex.append(
                        String.format("%02x", b)
                );
            }

            return hex.toString();

        } catch (NoSuchAlgorithmException e) {

            throw new IllegalStateException(
                    "SHA-256 algorithm not available",
                    e
            );
        }
    }

    // =========================================================
    // NORMALIZE HASH
    // =========================================================

    private String normalizeHash(String hash) {

        if (hash == null) {
            return "";
        }

        String normalized = hash.trim();

        if (normalized.startsWith("0x")
                || normalized.startsWith("0X")) {

            normalized =
                    normalized.substring(2);
        }

        return normalized;
    }

    // =========================================================
    // NORMALIZE STRING
    // =========================================================

    private String normalizeString(String value) {

        if (value == null) {
            return "";
        }

        return value.trim();
    }

    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateAssetName(String assetName) {

        if (assetName == null
                || assetName.isBlank()) {

            throw new IllegalArgumentException(
                    "Asset name cannot be empty"
            );
        }
    }

    private void validateAssetType(String assetType) {

        if (assetType == null
                || assetType.isBlank()) {

            throw new IllegalArgumentException(
                    "Asset type cannot be empty"
            );
        }
    }

    private void validateOwnerId(Long ownerId) {

        if (ownerId == null || ownerId <= 0) {

            throw new IllegalArgumentException(
                    "Owner ID must be a valid positive number"
            );
        }
    }
}