package com.AegisID.backend.asset.controller;

import com.AegisID.backend.asset.entity.DigitalAsset;
import com.AegisID.backend.asset.service.DigitalAssetService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
public class DigitalAssetController {

    private final DigitalAssetService assetService;

    public DigitalAssetController(
            DigitalAssetService assetService
    ) {
        this.assetService = assetService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DigitalAsset> createAsset(

            @RequestParam String assetName,

            @RequestParam(required = false)
            String description,

            @RequestParam(required = false)
            Long ownerId,

            @RequestParam("file")
            MultipartFile file

    ) throws Exception {

        DigitalAsset asset =
                assetService.createAsset(
                        assetName,
                        description,
                        ownerId,
                        file
                );

        return ResponseEntity.ok(asset);
    }

    @GetMapping
    public ResponseEntity<List<DigitalAsset>> getAllAssets() {

        return ResponseEntity.ok(
                assetService.getAllAssets()
        );
    }

    @GetMapping("/asset-id/{assetId}")
    public ResponseEntity<DigitalAsset> getAssetById(
            @PathVariable String assetId
    ) {

        return ResponseEntity.ok(
                assetService.getByAssetId(assetId)
        );
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<DigitalAsset>> getAssetsByOwner(
            @PathVariable Long ownerId
    ) {

        return ResponseEntity.ok(
                assetService.getByOwnerId(ownerId)
        );
    }

    @GetMapping("/asset-id/{assetId}/file")
    public ResponseEntity<Resource> getAssetFile(
            @PathVariable String assetId
    ) throws Exception {

        Path path =
                assetService.getAssetFile(assetId);

        Resource resource =
                new FileSystemResource(path);

        String contentType =
                Files.probeContentType(path);

        if (contentType == null) {
            contentType =
                    MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(contentType)
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                path.getFileName() +
                                "\""
                )
                .body(resource);
    }

    @GetMapping("/asset-id/{assetId}/verify")
    public ResponseEntity<Map<String, Object>> verifyAsset(
            @PathVariable String assetId
    ) {

        DigitalAsset asset =
                assetService.getByAssetId(assetId);

        boolean verified =
                assetService.verifyAsset(assetId);

        return ResponseEntity.ok(
                Map.of(
                        "assetId",
                        asset.getAssetId(),

                        "verified",
                        verified,

                        "status",
                        verified
                                ? "INTEGRITY_VERIFIED"
                                : "INTEGRITY_FAILED",

                        "storedHash",
                        asset.getFileHash()
                )
        );
    }
}