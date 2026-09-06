package com.AegisID.backend.user.service;

import com.AegisID.backend.user.entity.User;
import com.AegisID.backend.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // GET ALL USERS
    // =========================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // =========================
    // GET USER BY ID
    // =========================

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id
                        )
                );
    }

    // =========================
    // CREATE USER
    // =========================

    public User createUser(User user) {

        // Check username
        if (userRepository.existsByUsername(user.getUsername())) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }

        // Check email
        if (userRepository.existsByEmail(user.getEmail())) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        /*
         * Hash password before saving.
         *
         * The value currently received through passwordHash
         * is treated as the raw password temporarily.
         *
         * Later, Phase 5 will introduce a proper
         * RegisterRequest DTO with a "password" field.
         */
        if (user.getPasswordHash() != null &&
                !user.getPasswordHash().isBlank()) {

            user.setPasswordHash(
                    passwordEncoder.encode(
                            user.getPasswordHash()
                    )
            );
        }

        return userRepository.save(user);
    }

    // =========================
    // UPDATE USER
    // =========================

    public User updateUser(
            Long id,
            User updatedUser) {

        User existingUser = getUserById(id);

        existingUser.setUsername(
                updatedUser.getUsername()
        );

        existingUser.setEmail(
                updatedUser.getEmail()
        );

        existingUser.setStatus(
                updatedUser.getStatus()
        );

        /*
         * Only change the password if a new password
         * was actually supplied.
         */
        if (updatedUser.getPasswordHash() != null &&
                !updatedUser.getPasswordHash().isBlank()) {

            existingUser.setPasswordHash(
                    passwordEncoder.encode(
                            updatedUser.getPasswordHash()
                    )
            );
        }

        return userRepository.save(existingUser);
    }

    // =========================
    // DELETE USER
    // =========================

    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found with id: " + id
            );
        }

        userRepository.deleteById(id);
    }
}