package com.AegisID.backend.organization.controller;

import com.AegisID.backend.organization.entity.Organization;
import com.AegisID.backend.organization.service.OrganizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(
            OrganizationService organizationService) {

        this.organizationService = organizationService;
    }

    @GetMapping
    public ResponseEntity<List<Organization>> getAllOrganizations() {

        return ResponseEntity.ok(
                organizationService.getAllOrganizations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganizationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                organizationService.getOrganizationById(id));
    }

    @PostMapping
    public ResponseEntity<Organization> createOrganization(
            @RequestBody Organization organization) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(organizationService.createOrganization(organization));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organization> updateOrganization(
            @PathVariable Long id,
            @RequestBody Organization organization) {

        return ResponseEntity.ok(
                organizationService.updateOrganization(id, organization));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(
            @PathVariable Long id) {

        organizationService.deleteOrganization(id);

        return ResponseEntity.noContent().build();
    }
}