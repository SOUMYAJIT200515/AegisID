package com.AegisID.backend.authentication.service;

import com.AegisID.backend.authentication.entity.Identity;
import com.AegisID.backend.authentication.repsitory.IdentityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IdentityService {

    private final IdentityRepository identityRepository;

    public IdentityService(IdentityRepository identityRepository) {
        this.identityRepository = identityRepository;
    }

    public List<Identity> getAllIdentities() {
        return identityRepository.findAll();
    }

    public Identity getIdentityById(Long id) {
        return identityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Identity not found with id: " + id));
    }

    public Identity getIdentityByUserId(Long userId) {
        return identityRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Identity not found for user: " + userId));
    }

    public Identity createIdentity(Identity identity) {

        if (identityRepository.existsByUserId(identity.getUserId())) {
            throw new RuntimeException(
                    "Identity already exists for this user");
        }

        if (identityRepository.existsByDid(identity.getDid())) {
            throw new RuntimeException("DID already exists");
        }

        if (identity.getWalletAddress() != null
                && identityRepository.existsByWalletAddress(
                identity.getWalletAddress())) {

            throw new RuntimeException("Wallet address already exists");
        }

        return identityRepository.save(identity);
    }
}