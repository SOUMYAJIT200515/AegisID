package com.AegisID.backend.identity.service;

import com.AegisID.backend.identity.entity.Identity;
import com.AegisID.backend.identity.repository.IdentityRepository;
import com.AegisID.backend.identity.util.IdentityHashUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IdentityService {

    private final IdentityRepository identityRepository;

    public IdentityService(IdentityRepository identityRepository) {
        this.identityRepository = identityRepository;
    }

    // Get all identities
    public List<Identity> getAllIdentities() {
        return identityRepository.findAll();
    }

    // Get identity by ID
    public Identity getIdentityById(Long id) {
        return identityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Identity not found with id: " + id));
    }

    // Get identity by User ID
    public Identity getIdentityByUserId(Long userId) {
        return identityRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Identity not found for user: " + userId));
    }

    // Get identity by DID
    public Identity getIdentityByDid(String did) {
        return identityRepository.findByDid(did)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Identity not found with DID: " + did));
    }

    // Get identity by wallet address
    public Identity getIdentityByWalletAddress(String walletAddress) {
        return identityRepository.findByWalletAddress(walletAddress)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Identity not found with wallet address: "
                                        + walletAddress));
    }

    // Create new identity
    public Identity createIdentity(Identity identity) {

        if (identityRepository.existsByUserId(identity.getUserId())) {
            throw new RuntimeException(
                    "Identity already exists for this user");
        }

        if (identityRepository.existsByDid(identity.getDid())) {
            throw new RuntimeException(
                    "DID already exists");
        }

        if (identity.getWalletAddress() != null
                && identityRepository.existsByWalletAddress(
                identity.getWalletAddress())) {

            throw new RuntimeException(
                    "Wallet address already exists");
        }

        return identityRepository.save(identity);
    }

    // Update wallet address
    public Identity updateWalletAddress(Long identityId,
                                        String walletAddress) {

        Identity identity = getIdentityById(identityId);

        if (walletAddress != null
                && !walletAddress.equals(identity.getWalletAddress())
                && identityRepository.existsByWalletAddress(walletAddress)) {

            throw new RuntimeException(
                    "Wallet address already exists");
        }

        identity.setWalletAddress(walletAddress);

        return identityRepository.save(identity);
    }

    // Verify identity
    public Identity verifyIdentity(Long identityId) {

        Identity identity = getIdentityById(identityId);

        identity.setVerificationStatus(
                Identity.VerificationStatus.VERIFIED);

        return identityRepository.save(identity);
    }

    // Reject identity verification
    public Identity rejectIdentity(Long identityId) {

        Identity identity = getIdentityById(identityId);

        identity.setVerificationStatus(
                Identity.VerificationStatus.REJECTED);

        return identityRepository.save(identity);
    }

    // Suspend identity
    public Identity suspendIdentity(Long identityId) {

        Identity identity = getIdentityById(identityId);

        identity.setIdentityStatus(
                Identity.IdentityStatus.SUSPENDED);

        return identityRepository.save(identity);
    }

    // Revoke identity
    public Identity revokeIdentity(Long identityId) {

        Identity identity = getIdentityById(identityId);

        identity.setIdentityStatus(
                Identity.IdentityStatus.REVOKED);

        return identityRepository.save(identity);
    }

    // Reactivate identity
    public Identity reactivateIdentity(Long identityId) {

        Identity identity = getIdentityById(identityId);

        identity.setIdentityStatus(
                Identity.IdentityStatus.ACTIVE);

        return identityRepository.save(identity);
    }
    public String generateIdentityHash(Long identityId) {

        Identity identity = getIdentityById(identityId);

        return IdentityHashUtil.generateIdentityHash(
                identity.getDid()
        );
    }
}