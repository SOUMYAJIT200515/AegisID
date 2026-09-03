package com.AegisID.backend.permission.service;

import com.AegisID.backend.permission.entity.Permission;
import com.AegisID.backend.permission.repsitory.PermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    public Permission getPermissionById(Long id) {
        return permissionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Permission not found with id: " + id
                        )
                );
    }

    public Permission getByCode(String code) {
        return permissionRepository.findByPermissionCode(code)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Permission not found: " + code
                        )
                );
    }

    public List<Permission> getByModule(String module) {
        return permissionRepository.findByModule(module);
    }

    public Permission createPermission(Permission permission) {

        if (permissionRepository.existsByPermissionCode(
                permission.getPermissionCode())) {

            throw new RuntimeException(
                    "Permission code already exists"
            );
        }

        return permissionRepository.save(permission);
    }

    public Permission updatePermission(
            Long id,
            Permission updatedPermission) {

        Permission existing = getPermissionById(id);

        existing.setName(updatedPermission.getName());
        existing.setModule(updatedPermission.getModule());
        existing.setDescription(updatedPermission.getDescription());
        existing.setStatus(updatedPermission.getStatus());

        return permissionRepository.save(existing);
    }
}