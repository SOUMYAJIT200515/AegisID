package com.AegisID.backend.authentication.repsitory;

import com.AegisID.backend.user.entity.User;
import com.AegisID.backend.user.repository.UserRepository;

import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCredentialUserEntity;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialUserEntity;
import org.springframework.security.web.webauthn.management.PublicKeyCredentialUserEntityRepository;
import org.springframework.stereotype.Repository;

import java.nio.charset.StandardCharsets;

@Repository
public class SpringWebAuthnUserRepository
        implements PublicKeyCredentialUserEntityRepository {

    private final UserRepository userRepository;

    public SpringWebAuthnUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public PublicKeyCredentialUserEntity findById(Bytes id) {

        String userHandle = new String(
                id.getBytes(),
                StandardCharsets.UTF_8
        );

        return userRepository.findByWebauthnUserHandle(userHandle)
                .map(this::convert)
                .orElse(null);
    }

    @Override
    public PublicKeyCredentialUserEntity findByUsername(String username) {

        return userRepository.findByUsername(username)
                .map(this::convert)
                .orElse(null);
    }

    @Override
    public void save(PublicKeyCredentialUserEntity userEntity) {
        // Users are managed by AegisID User module.
    }

    @Override
    public void delete(Bytes id) {
        // Users are managed by AegisID User module.
    }

    private PublicKeyCredentialUserEntity convert(User user) {

        Bytes userHandle = new Bytes(
                user.getWebauthnUserHandle()
                        .getBytes(StandardCharsets.UTF_8)
        );

        return ImmutablePublicKeyCredentialUserEntity.builder()
                .id(userHandle)
                .name(user.getUsername())
                .displayName(user.getFullName())
                .build();
    }
}