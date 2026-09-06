package com.AegisID.backend.organization.service;

import com.AegisID.backend.organization.entity.Organization;
import com.AegisID.backend.organization.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public Organization getOrganizationById(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Organization not found with id: " + id));
    }

    public Organization createOrganization(Organization organization) {

        if (organizationRepository.existsByOrganizationCode(
                organization.getOrganizationCode())) {

            throw new RuntimeException("Organization code already exists");
        }

        if (organizationRepository.existsByName(
                organization.getName())) {

            throw new RuntimeException("Organization name already exists");
        }

        return organizationRepository.save(organization);
    }

    public Organization updateOrganization(
            Long id,
            Organization updatedOrganization) {

        Organization existingOrganization =
                getOrganizationById(id);

        if (!existingOrganization.getOrganizationCode()
                .equals(updatedOrganization.getOrganizationCode())
                && organizationRepository.existsByOrganizationCode(
                updatedOrganization.getOrganizationCode())) {

            throw new RuntimeException(
                    "Organization code already exists");
        }

        existingOrganization.setOrganizationCode(
                updatedOrganization.getOrganizationCode());

        existingOrganization.setName(
                updatedOrganization.getName());

        existingOrganization.setDescription(
                updatedOrganization.getDescription());

        existingOrganization.setStatus(
                updatedOrganization.getStatus());

        return organizationRepository.save(existingOrganization);
    }

    public void deleteOrganization(Long id) {

        if (!organizationRepository.existsById(id)) {
            throw new RuntimeException(
                    "Organization not found with id: " + id);
        }

        organizationRepository.deleteById(id);
    }
}