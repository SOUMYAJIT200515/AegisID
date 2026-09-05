package com.AegisID.backend.asset.service;

import com.AegisID.backend.asset.entity.DigitalAsset;
import com.AegisID.backend.asset.service.DigitalAssetService;
import com.AegisID.backend.asset.repsitory.DigitalAssetRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.UUID;

@Service
public class DigitalAssetService {

    private final DigitalAssetRepository assetRepository;

    @Value("${aegisid.storage.asset-directory:./assets}")
    private String assetDirectory;

    public DigitalAssetService(DigitalAssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Transactional
    public DigitalAsset createAsset(
            String assetName,
            String description,
            Long ownerId,
            MultipartFile file
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Asset file is required");
        }

        String assetId = generateAssetId();

        String originalFileName = sanitizeFileName(file.getOriginalFilename());

        String fileFormat = getFileExtension(originalFileName);

        String storedFileName = assetId +
                (fileFormat.isEmpty() ? "" : "." + fileFormat);

        Path rootPath = Paths.get(assetDirectory)
                .toAbsolutePath()
                .normalize();

        Path assetFolder = rootPath.resolve(assetId).normalize();

        Files.createDirectories(assetFolder);

        Path targetFile = assetFolder
                .resolve(storedFileName)
                .normalize();

        if (!targetFile.startsWith(assetFolder)) {
            throw new SecurityException("Invalid file path");
        }

        Files.copy(
                file.getInputStream(),
                targetFile,
                StandardCopyOption.REPLACE_EXISTING
        );

        String fileHash = calculateSha256(targetFile);

        DigitalAsset asset = new DigitalAsset();

        asset.setAssetId(assetId);
        asset.setAssetName(assetName);
        asset.setDescription(description);
        asset.setOriginalFileName(originalFileName);
        asset.setStoredFileName(storedFileName);
        asset.setFileFormat(fileFormat.toUpperCase());
        asset.setContentType(file.getContentType());
        asset.setFileSize(file.getSize());

        /*
         * Store relative paths in the database.
         * Never store D:\... or C:\... absolute paths.
         */
        String relativeFolder = "assets/" + assetId + "/";
        String relativePath = relativeFolder + storedFileName;

        asset.setStorageFolder(relativeFolder);
        asset.setStoragePath(relativePath);

        asset.setFileHash(fileHash);
        asset.setStatus("REGISTERED");
        asset.setOwnerId(ownerId);

        return assetRepository.save(asset);
    }

    public List<DigitalAsset> getAllAssets() {
        return assetRepository.findAll();
    }

    public DigitalAsset getByAssetId(String assetId) {

        return assetRepository.findByAssetId(assetId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Asset not found: " + assetId
                        )
                );
    }

    public List<DigitalAsset> getByOwnerId(Long ownerId) {
        return assetRepository.findByOwnerId(ownerId);
    }

    public Path getAssetFile(String assetId) {

        DigitalAsset asset = getByAssetId(assetId);

        Path rootPath = Paths.get(assetDirectory)
                .toAbsolutePath()
                .normalize();

        Path filePath = rootPath
                .resolve(asset.getAssetId())
                .resolve(asset.getStoredFileName())
                .normalize();

        if (!filePath.startsWith(rootPath)) {
            throw new SecurityException("Invalid asset path");
        }

        if (!Files.exists(filePath)) {
            throw new RuntimeException("Stored asset file not found");
        }

        return filePath;
    }

    public boolean verifyAsset(String assetId) {

        DigitalAsset asset = getByAssetId(assetId);

        Path filePath = getAssetFile(assetId);

        try {

            String currentHash = calculateSha256(filePath);

            return currentHash.equalsIgnoreCase(
                    asset.getFileHash()
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to verify asset",
                    e
            );
        }
    }

    private String generateAssetId() {

        String assetId;

        do {

            String randomPart = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 8)
                    .toUpperCase();

            assetId = "AST-" + randomPart;

        } while (assetRepository.existsByAssetId(assetId));

        return assetId;
    }

    private String sanitizeFileName(String fileName) {

        if (fileName == null || fileName.isBlank()) {
            return "uploaded-file";
        }

        return Paths.get(fileName)
                .getFileName()
                .toString();
    }

    private String getFileExtension(String fileName) {

        int index = fileName.lastIndexOf('.');

        if (index <= 0 || index == fileName.length() - 1) {
            return "";
        }

        return fileName.substring(index + 1)
                .toLowerCase();
    }

    private String calculateSha256(Path file)
            throws IOException {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            try (InputStream inputStream =
                         Files.newInputStream(file)) {

                byte[] buffer = new byte[8192];

                int bytesRead;

                while ((bytesRead =
                        inputStream.read(buffer)) != -1) {

                    digest.update(
                            buffer,
                            0,
                            bytesRead
                    );
                }
            }

            byte[] hash = digest.digest();

            StringBuilder result =
                    new StringBuilder();

            for (byte b : hash) {

                result.append(
                        String.format(
                                "%02x",
                                b
                        )
                );
            }

            return result.toString();

        } catch (NoSuchAlgorithmException e) {

            throw new RuntimeException(
                    "SHA-256 algorithm not available",
                    e
            );
        }
    }
}