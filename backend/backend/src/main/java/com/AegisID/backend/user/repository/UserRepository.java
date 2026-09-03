package com.AegisID.backend.user.repository;

import com.AegisID.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByWebauthnUserHandle(String webauthnUserHandle);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByWebauthnUserHandle(String webauthnUserHandle);
}