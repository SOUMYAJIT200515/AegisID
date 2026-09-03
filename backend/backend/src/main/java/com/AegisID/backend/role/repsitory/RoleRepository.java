package com.AegisID.backend.role.repsitory;

import com.AegisID.backend.role.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

    List<Role> findByOrganizationId(Long organizationId);

    List<Role> findByStatus(Role.Status status);

    boolean existsByNameAndOrganizationId(
            String name,
            Long organizationId
    );
}