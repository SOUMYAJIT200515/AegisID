package com.AegisID.backend.permission.repsitory;

import com.AegisID.backend.permission.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository
        extends JpaRepository<Permission, Long> {

    Optional<Permission> findByPermissionCode(String permissionCode);

    List<Permission> findByModule(String module);

    List<Permission> findByStatus(Permission.Status status);

    boolean existsByPermissionCode(String permissionCode);
}