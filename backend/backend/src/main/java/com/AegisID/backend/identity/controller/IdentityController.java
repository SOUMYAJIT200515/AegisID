package com.AegisID.backend.identity.controller;

import com.AegisID.backend.identity.entity.Identity;
import com.AegisID.backend.identity.service.IdentityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/identities")
public class IdentityController {

    private final IdentityService identityService;

    public IdentityController(IdentityService identityService) {
        this.identityService = identityService;
    }

    // Get all identities
    @GetMapping
    public ResponseEntity<List<Identity>> getAllIdentities() {
        return ResponseEntity.ok(
                identityService.getAllIdentities()
        );
    }

    // Get identity by ID
    @GetMapping("/{id}")
    public ResponseEntity<Identity> getIdentityById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                identityService.getIdentityById(id)
        );
    }

    // Get identity by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<Identity> getIdentityByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                identityService.getIdentityByUserId(userId)
        );
    }

    // Get identity by DID
    @GetMapping("/did/{did}")
    public ResponseEntity<Identity> getIdentityByDid(
            @PathVariable String did) {

        return ResponseEntity.ok(
                identityService.getIdentityByDid(did)
        );
    }

    // Get identity by wallet address
    @GetMapping("/wallet/{walletAddress}")
    public ResponseEntity<Identity> getIdentityByWalletAddress(
            @PathVariable String walletAddress) {

        return ResponseEntity.ok(
                identityService.getIdentityByWalletAddress(walletAddress)
        );
    }

    // Create new identity
    @PostMapping
    public ResponseEntity<Identity> createIdentity(
            @RequestBody Identity identity) {

        return ResponseEntity.ok(
                identityService.createIdentity(identity)
        );
    }

    // Update wallet address
    @PutMapping("/{id}/wallet")
    public ResponseEntity<Identity> updateWalletAddress(
            @PathVariable Long id,
            @RequestParam String walletAddress) {

        return ResponseEntity.ok(
                identityService.updateWalletAddress(
                        id,
                        walletAddress
                )
        );
    }

    // Verify identity
    @PutMapping("/{id}/verify")
    public ResponseEntity<Identity> verifyIdentity(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                identityService.verifyIdentity(id)
        );
    }

    // Reject identity verification
    @PutMapping("/{id}/reject")
    public ResponseEntity<Identity> rejectIdentity(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                identityService.rejectIdentity(id)
        );
    }

    // Suspend identity
    @PutMapping("/{id}/suspend")
    public ResponseEntity<Identity> suspendIdentity(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                identityService.suspendIdentity(id)
        );
    }

    // Revoke identity
    @PutMapping("/{id}/revoke")
    public ResponseEntity<Identity> revokeIdentity(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                identityService.revokeIdentity(id)
        );
    }

    // Reactivate identity
    @PutMapping("/{id}/reactivate")
    public ResponseEntity<Identity> reactivateIdentity(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                identityService.reactivateIdentity(id)
        );
    }
}