package com.AegisID.backend.blockchain.controller;

import com.AegisID.backend.blockchain.service.BlockchainService;
import com.AegisID.backend.blockchain.service.BlockchainVerificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainController {

    private final BlockchainService blockchainService;
    private final BlockchainVerificationService blockchainVerificationService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public BlockchainController(
            BlockchainService blockchainService,
            BlockchainVerificationService blockchainVerificationService) {

        this.blockchainService =
                blockchainService;

        this.blockchainVerificationService =
                blockchainVerificationService;
    }


    // =========================================================
    // BLOCKCHAIN STATUS
    // =========================================================

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getBlockchainStatus()
            throws Exception {

        String networkVersion =
                blockchainService.getNetworkVersion();

        BigInteger blockNumber =
                blockchainService.getBlockNumber();

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "connected",
                true
        );

        response.put(
                "networkVersion",
                networkVersion
        );

        response.put(
                "blockNumber",
                blockNumber
        );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // CONTRACT INFORMATION
    // =========================================================

    @GetMapping("/contract")
    public ResponseEntity<Map<String, Object>> getContractStatus() {

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "contractAddress",
                blockchainService.getContractAddress()
        );

        response.put(
                "message",
                "AegisIDRegistry contract configured"
        );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // READ IDENTITY FROM BLOCKCHAIN
    // =========================================================

    @GetMapping("/identity/{identityHash}")
    public ResponseEntity<?> getIdentity(
            @PathVariable String identityHash)
            throws Exception {

        List<?> result =
                blockchainService.getIdentity(
                        identityHash
                );

        return ResponseEntity.ok(result);
    }


    // =========================================================
    // ANCHOR IDENTITY
    // =========================================================

    @PostMapping("/identity/anchor")
    public ResponseEntity<?> anchorIdentity(
            @RequestParam String identityHash,
            @RequestParam String walletAddress)
            throws Exception {

        String transactionHash =
                blockchainService.anchorIdentity(
                        identityHash,
                        walletAddress
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "Identity anchored successfully"
        );

        response.put(
                "transactionHash",
                transactionHash
        );

        response.put(
                "identityHash",
                identityHash
        );

        response.put(
                "walletAddress",
                walletAddress
        );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // ANCHOR CREDENTIAL
    // =========================================================

    @PostMapping("/credential/anchor")
    public ResponseEntity<?> anchorCredential(
            @RequestParam String credentialHash,
            @RequestParam String identityHash)
            throws Exception {

        String transactionHash =
                blockchainService.anchorCredential(
                        credentialHash,
                        identityHash
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "Credential anchored successfully"
        );

        response.put(
                "credentialHash",
                credentialHash
        );

        response.put(
                "identityHash",
                identityHash
        );

        response.put(
                "transactionHash",
                transactionHash
        );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // READ CREDENTIAL FROM BLOCKCHAIN
    // =========================================================

    @GetMapping("/credential/{credentialHash}")
    public ResponseEntity<?> getCredential(
            @PathVariable String credentialHash)
            throws Exception {

        List<?> result =
                blockchainService.getCredential(
                        credentialHash
                );

        return ResponseEntity.ok(result);
    }


    // =========================================================
    // VERIFY CREDENTIAL AGAINST BLOCKCHAIN
    // =========================================================

    @GetMapping("/credential/{credentialId}/verify")
    public ResponseEntity<?> verifyCredentialOnBlockchain(
            @PathVariable Long credentialId)
            throws Exception {

        Map<String, Object> result =
                blockchainVerificationService
                        .verifyCredentialOnBlockchain(
                                credentialId
                        );

        return ResponseEntity.ok(result);
    }
}