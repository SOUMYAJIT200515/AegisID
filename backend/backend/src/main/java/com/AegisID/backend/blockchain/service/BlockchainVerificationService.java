package com.AegisID.backend.blockchain.service;

import com.AegisID.backend.credential.entity.VerifiableCredential;
import com.AegisID.backend.credential.service.VerifiableCredentialService;
import com.AegisID.backend.identity.entity.Identity;
import com.AegisID.backend.identity.repository.IdentityRepository;
import com.AegisID.backend.identity.util.IdentityHashUtil;

import org.springframework.stereotype.Service;

import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.utils.Numeric;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class BlockchainVerificationService {

    private final BlockchainService blockchainService;
    private final VerifiableCredentialService credentialService;
    private final IdentityRepository identityRepository;

    public BlockchainVerificationService(
            BlockchainService blockchainService,
            VerifiableCredentialService credentialService,
            IdentityRepository identityRepository) {

        this.blockchainService = blockchainService;
        this.credentialService = credentialService;
        this.identityRepository = identityRepository;
    }

    // =========================================================
    // VERIFY CREDENTIAL AGAINST BLOCKCHAIN
    // =========================================================

    public Map<String, Object> verifyCredentialOnBlockchain(
            Long credentialId) throws Exception {

        Map<String, Object> result =
                new LinkedHashMap<>();

        // =====================================================
        // 1. GET CREDENTIAL FROM MYSQL
        // =====================================================

        VerifiableCredential credential =
                credentialService.getCredentialById(
                        credentialId
                );

        String credentialHash =
                credential.getCredentialHash();

        result.put(
                "credentialId",
                credentialId
        );

        result.put(
                "databaseCredentialHash",
                credentialHash
        );

        result.put(
                "credentialStatus",
                credential.getStatus().toString()
        );

        // =====================================================
        // 2. VERIFY DATABASE INTEGRITY
        // =====================================================

        boolean databaseHashValid =
                credentialService.verifyCredential(
                        credentialId
                );

        result.put(
                "databaseHashValid",
                databaseHashValid
        );

        // =====================================================
        // 3. GET IDENTITY FROM MYSQL
        // =====================================================

        Identity identity =
                identityRepository.findById(
                        credential.getIdentityId()
                ).orElse(null);

        if (identity == null) {

            result.put(
                    "identityFound",
                    false
            );

            result.put(
                    "valid",
                    false
            );

            result.put(
                    "message",
                    "Identity associated with credential was not found"
            );

            return result;
        }

        result.put(
                "identityFound",
                true
        );

        // =====================================================
        // 4. GENERATE IDENTITY HASH
        // =====================================================

        String calculatedIdentityHash =
                IdentityHashUtil.generateIdentityHash(
                        identity.getDid()
                );

        result.put(
                "calculatedIdentityHash",
                calculatedIdentityHash
        );

        // =====================================================
        // 5. READ CREDENTIAL FROM BLOCKCHAIN
        // =====================================================

        List<Type> blockchainCredential =
                blockchainService.getCredential(
                        credentialHash.startsWith("0x")
                                ? credentialHash
                                : "0x" + credentialHash
                );

        // =====================================================
        // 6. CHECK WHETHER BLOCKCHAIN PROOF EXISTS
        // =====================================================

        if (blockchainCredential == null
                || blockchainCredential.size() < 5) {

            result.put(
                    "blockchainProofFound",
                    false
            );

            result.put(
                    "valid",
                    false
            );

            result.put(
                    "message",
                    "Credential proof was not found on blockchain"
            );

            return result;
        }

        // =====================================================
        // 7. DECODE BLOCKCHAIN CREDENTIAL HASH
        // =====================================================

        Bytes32 blockchainCredentialHashValue =
                (Bytes32) blockchainCredential.get(0);

        String blockchainCredentialHash =
                Numeric.toHexString(
                        blockchainCredentialHashValue.getValue()
                );

        // =====================================================
        // 8. CHECK FOR ZERO HASH
        // =====================================================
        // Solidity mappings return a default struct when the
        // credential does not exist. Therefore, getCredential()
        // can still return 5 values containing zero/default data.

        if (normalizeHash(blockchainCredentialHash)
                .equals(
                        "0000000000000000000000000000000000000000000000000000000000000000"
                )) {

            result.put(
                    "blockchainProofFound",
                    false
            );

            result.put(
                    "valid",
                    false
            );

            result.put(
                    "message",
                    "Credential proof was not found on blockchain"
            );

            return result;
        }

        result.put(
                "blockchainProofFound",
                true
        );

        result.put(
                "blockchainCredentialHash",
                blockchainCredentialHash
        );

        // =====================================================
        // 9. DECODE BLOCKCHAIN IDENTITY HASH
        // =====================================================

        Bytes32 blockchainIdentityHashValue =
                (Bytes32) blockchainCredential.get(1);

        String blockchainIdentityHash =
                Numeric.toHexString(
                        blockchainIdentityHashValue.getValue()
                );

        result.put(
                "blockchainIdentityHash",
                blockchainIdentityHash
        );

        // =====================================================
        // 10. COMPARE CREDENTIAL HASHES
        // =====================================================

        boolean credentialHashMatches =
                normalizeHash(credentialHash)
                        .equalsIgnoreCase(
                                normalizeHash(
                                        blockchainCredentialHash
                                )
                        );

        result.put(
                "credentialHashMatches",
                credentialHashMatches
        );

        // =====================================================
        // 11. COMPARE IDENTITY HASHES
        // =====================================================

        boolean identityHashMatches =
                normalizeHash(
                        calculatedIdentityHash
                ).equalsIgnoreCase(
                        normalizeHash(
                                blockchainIdentityHash
                        )
                );

        result.put(
                "identityHashMatches",
                identityHashMatches
        );

        // =====================================================
        // 12. BLOCKCHAIN ACTIVE STATUS
        // =====================================================

        Boolean blockchainActive =
                (Boolean) blockchainCredential
                        .get(4)
                        .getValue();

        result.put(
                "blockchainActive",
                blockchainActive
        );

        // =====================================================
        // 13. FINAL INTEGRITY RESULT
        // =====================================================

        boolean integrityValid =
                databaseHashValid
                        && credentialHashMatches
                        && identityHashMatches;

        result.put(
                "integrityValid",
                integrityValid
        );

        // =====================================================
        // 14. FINAL VALIDATION RESULT
        // =====================================================

        boolean valid =
                integrityValid
                        && blockchainActive;

        result.put(
                "valid",
                valid
        );

        // =====================================================
        // 15. FINAL MESSAGE
        // =====================================================

        if (valid) {

            result.put(
                    "message",
                    "Credential is valid and blockchain integrity verified"
            );

        } else if (!databaseHashValid) {

            result.put(
                    "message",
                    "Credential database data has been tampered with"
            );

        } else if (!credentialHashMatches) {

            result.put(
                    "message",
                    "Credential hash does not match blockchain proof"
            );

        } else if (!identityHashMatches) {

            result.put(
                    "message",
                    "Identity hash does not match blockchain proof"
            );

        } else if (!blockchainActive) {

            result.put(
                    "message",
                    "Credential blockchain record is inactive"
            );

        } else {

            result.put(
                    "message",
                    "Credential verification failed"
            );
        }

        return result;
    }

    // =========================================================
    // NORMALIZE HASH
    // =========================================================

    private String normalizeHash(String hash) {

        if (hash == null) {
            return "";
        }

        String normalized =
                hash.trim();

        if (normalized.startsWith("0x")
                || normalized.startsWith("0X")) {

            normalized =
                    normalized.substring(2);
        }

        return normalized;
    }
}