package com.AegisID.backend.authentication.service;

import com.AegisID.backend.authentication.entity.WebAuthnCredential;
import com.AegisID.backend.authentication.repsitory.WebAuthnCredentialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebAuthnCredentialService {

    private final WebAuthnCredentialRepository credentialRepository;

    public WebAuthnCredentialService(
            WebAuthnCredentialRepository credentialRepository) {

        this.credentialRepository = credentialRepository;
    }

    public List<WebAuthnCredential> getCredentialsByUserId(Long userId) {
        return credentialRepository.findByUserId(userId);
    }

    public WebAuthnCredential getByCredentialId(String credentialId) {
        return credentialRepository.findByCredentialId(credentialId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "WebAuthn credential not found"));
    }

    public WebAuthnCredential saveCredential(
            WebAuthnCredential credential) {

        if (credentialRepository.existsByCredentialId(
                credential.getCredentialId())) {

            throw new RuntimeException(
                    "WebAuthn credential already exists");
        }

        return credentialRepository.save(credential);
    }
}