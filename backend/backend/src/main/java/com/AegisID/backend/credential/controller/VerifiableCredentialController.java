package com.AegisID.backend.credential.controller;

import com.AegisID.backend.credential.entity.VerifiableCredential;
import com.AegisID.backend.credential.service.VerifiableCredentialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
public class VerifiableCredentialController {

    private final VerifiableCredentialService credentialService;

    public VerifiableCredentialController(
            VerifiableCredentialService credentialService) {

        this.credentialService = credentialService;
    }


    // =========================
    // GET ALL CREDENTIALS
    // =========================

    @GetMapping
    public ResponseEntity<List<VerifiableCredential>>
    getAllCredentials() {

        return ResponseEntity.ok(
                credentialService.getAllCredentials()
        );
    }


    // =========================
    // GET CREDENTIAL BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<VerifiableCredential>
    getCredentialById(@PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.getCredentialById(id)
        );
    }


    // =========================
    // GET BY IDENTITY
    // =========================

    @GetMapping("/identity/{identityId}")
    public ResponseEntity<List<VerifiableCredential>>
    getCredentialsByIdentityId(
            @PathVariable Long identityId) {

        return ResponseEntity.ok(
                credentialService.getCredentialsByIdentityId(
                        identityId
                )
        );
    }


    // =========================
    // GET BY ISSUER
    // =========================

    @GetMapping("/issuer/{issuerId}")
    public ResponseEntity<List<VerifiableCredential>>
    getCredentialsByIssuerId(
            @PathVariable Long issuerId) {

        return ResponseEntity.ok(
                credentialService.getCredentialsByIssuerId(
                        issuerId
                )
        );
    }


    // =========================
    // GET BY HASH
    // =========================

    @GetMapping("/hash/{credentialHash}")
    public ResponseEntity<VerifiableCredential>
    getCredentialByHash(
            @PathVariable String credentialHash) {

        return ResponseEntity.ok(
                credentialService.getCredentialByHash(
                        credentialHash
                )
        );
    }


    // =========================
    // VERIFY CREDENTIAL
    // =========================

    @GetMapping("/{id}/verify")
    public ResponseEntity<Boolean>
    verifyCredential(@PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.verifyCredential(id)
        );
    }


    // =========================
    // VALIDATE CREDENTIAL
    // =========================

    @GetMapping("/{id}/validate")
    public ResponseEntity<Boolean>
    validateCredential(@PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.validateCredential(id)
        );
    }


    // =========================
    // CREATE CREDENTIAL
    // =========================

    @PostMapping
    public ResponseEntity<VerifiableCredential>
    createCredential(
            @RequestBody VerifiableCredential credential) {

        return ResponseEntity.ok(
                credentialService.createCredential(
                        credential
                )
        );
    }


    // =========================
    // REVOKE CREDENTIAL
    // =========================

    @PutMapping("/{id}/revoke")
    public ResponseEntity<VerifiableCredential>
    revokeCredential(@PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.revokeCredential(id)
        );
    }


    // =========================
    // REACTIVATE CREDENTIAL
    // =========================

    @PutMapping("/{id}/reactivate")
    public ResponseEntity<VerifiableCredential>
    reactivateCredential(@PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.reactivateCredential(id)
        );
    }


    // =========================
    // EXPIRE CREDENTIAL
    // =========================

    @PutMapping("/{id}/expire")
    public ResponseEntity<VerifiableCredential>
    expireCredential(@PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.expireCredential(id)
        );
    }


    // =========================
    // GET BY STATUS
    // =========================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<VerifiableCredential>>
    getCredentialsByStatus(
            @PathVariable VerifiableCredential.CredentialStatus status) {

        return ResponseEntity.ok(
                credentialService.getCredentialsByStatus(status)
        );
    }
}