package com.AegisID.backend.asset.controller;

import com.AegisID.backend.asset.entity.DigitalAsset;
import com.AegisID.backend.asset.service.DigitalAssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class DigitalAssetController {

    private final DigitalAssetService assetService;

    public DigitalAssetController(
            DigitalAssetService assetService) {
        this.assetService = assetService;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<DigitalAsset> createAsset(
            @RequestBody CreateAssetRequest request) {

        DigitalAsset asset =
                assetService.createAsset(
                        request.assetName(),
                        request.assetType(),
                        request.description(),
                        request.ownerId()
                );

        return ResponseEntity.ok(asset);
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<List<DigitalAsset>> getAllAssets() {

        return ResponseEntity.ok(
                assetService.getAllAssets()
        );
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<DigitalAsset> getAssetById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assetService.getAssetById(id)
        );
    }

    // =========================================================
    // GET BY HASH
    // =========================================================

    @GetMapping("/hash/{assetHash}")
    public ResponseEntity<DigitalAsset> getAssetByHash(
            @PathVariable String assetHash) {

        return ResponseEntity.ok(
                assetService.getAssetByHash(assetHash)
        );
    }

    // =========================================================
    // GET BY OWNER
    // =========================================================

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<DigitalAsset>> getAssetsByOwner(
            @PathVariable Long ownerId) {

        return ResponseEntity.ok(
                assetService.getAssetsByOwner(ownerId)
        );
    }

    // =========================================================
    // GET BY STATUS
    // =========================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DigitalAsset>> getAssetsByStatus(
            @PathVariable DigitalAsset.AssetStatus status) {

        return ResponseEntity.ok(
                assetService.getAssetsByStatus(status)
        );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<DigitalAsset> updateAsset(
            @PathVariable Long id,
            @RequestBody UpdateAssetRequest request) {

        DigitalAsset asset =
                assetService.updateAsset(
                        id,
                        request.assetName(),
                        request.assetType(),
                        request.description()
                );

        return ResponseEntity.ok(asset);
    }

    // =========================================================
    // ASSIGN
    // =========================================================

    @PutMapping("/{id}/assign")
    public ResponseEntity<DigitalAsset> assignAsset(
            @PathVariable Long id,
            @RequestBody OwnerRequest request) {

        return ResponseEntity.ok(
                assetService.assignAsset(
                        id,
                        request.ownerId()
                )
        );
    }

    // =========================================================
    // TRANSFER
    // =========================================================

    @PutMapping("/{id}/transfer")
    public ResponseEntity<DigitalAsset> transferAsset(
            @PathVariable Long id,
            @RequestBody OwnerRequest request) {

        return ResponseEntity.ok(
                assetService.transferAsset(
                        id,
                        request.ownerId()
                )
        );
    }

    // =========================================================
    // REVOKE
    // =========================================================

    @PutMapping("/{id}/revoke")
    public ResponseEntity<DigitalAsset> revokeAsset(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assetService.revokeAsset(id)
        );
    }

    // =========================================================
    // RESTORE
    // =========================================================

    @PutMapping("/{id}/restore")
    public ResponseEntity<DigitalAsset> restoreAsset(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assetService.restoreAsset(id)
        );
    }

    // =========================================================
    // VERIFY DATABASE INTEGRITY
    // =========================================================

    @GetMapping("/{id}/verify")
    public ResponseEntity<Boolean> verifyAsset(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assetService.verifyAsset(id)
        );
    }

    // =========================================================
    // REQUEST RECORDS
    // =========================================================

    public record CreateAssetRequest(
            String assetName,
            String assetType,
            String description,
            Long ownerId
    ) {
    }

    public record UpdateAssetRequest(
            String assetName,
            String assetType,
            String description
    ) {
    }

    public record OwnerRequest(
            Long ownerId
    ) {
    }
}