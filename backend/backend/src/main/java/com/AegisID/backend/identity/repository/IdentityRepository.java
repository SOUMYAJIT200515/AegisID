package com.AegisID.backend.identity.repository;

import com.AegisID.backend.identity.entity.Identity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IdentityRepository extends JpaRepository<Identity, Long> {

    Optional<Identity> findByUserId(Long userId);

    Optional<Identity> findByDid(String did);

    Optional<Identity> findByWalletAddress(String walletAddress);

    boolean existsByUserId(Long userId);

    boolean existsByDid(String did);

    boolean existsByWalletAddress(String walletAddress);
}