package com.AegisID.backend.identity.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public final class IdentityHashUtil {

    private IdentityHashUtil() {
    }

    public static String generateIdentityHash(String did) {

        if (did == null || did.isBlank()) {
            throw new IllegalArgumentException("DID cannot be null or empty");
        }

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    did.trim().getBytes(StandardCharsets.UTF_8)
            );

            StringBuilder hex = new StringBuilder("0x");

            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }

            return hex.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 algorithm not available", e
            );
        }
    }
}