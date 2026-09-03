package com.AegisID.backend.role.service;

import com.AegisID.backend.role.entity.Role;
import com.AegisID.backend.role.entity.RolePermission;
import com.AegisID.backend.role.entity.UserRole;
import com.AegisID.backend.role.repsitory.RolePermissionRepository;
import com.AegisID.backend.role.repsitory.RoleRepository;
import com.AegisID.backend.role.repsitory.UserRoleRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final UserRoleRepository userRoleRepository;

    public RoleService(
            RoleRepository roleRepository,
            RolePermissionRepository rolePermissionRepository,
            UserRoleRepository userRoleRepository) {

        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.userRoleRepository = userRoleRepository;
    }

    // =========================
    // ROLE
    // =========================

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Role not found with id: " + id
                        )
                );
    }

    public List<Role> getRolesByOrganization(
            Long organizationId) {

        return roleRepository.findByOrganizationId(
                organizationId
        );
    }

    public Role createRole(Role role) {

        if (role.getOrganizationId() != null &&
                roleRepository.existsByNameAndOrganizationId(
                        role.getName(),
                        role.getOrganizationId())) {

            throw new RuntimeException(
                    "Role already exists in this organization"
            );
        }

        return roleRepository.save(role);
    }

    public Role updateRole(
            Long id,
            Role updatedRole) {

        Role existing = getRoleById(id);

        existing.setName(updatedRole.getName());
        existing.setDescription(updatedRole.getDescription());
        existing.setStatus(updatedRole.getStatus());

        // System-role status should not be changed
        // through normal update.

        return roleRepository.save(existing);
    }

    public void deleteRole(Long id) {

        Role role = getRoleById(id);

        if (Boolean.TRUE.equals(role.getSystemRole())) {
            throw new RuntimeException(
                    "System roles cannot be deleted"
            );
        }

        roleRepository.delete(role);
    }

    // =========================
    // ROLE PERMISSIONS
    // =========================

    @Transactional
    public RolePermission assignPermission(
            Long roleId,
            Long permissionId) {

        getRoleById(roleId);

        if (rolePermissionRepository
                .existsByRoleIdAndPermissionId(
                        roleId,
                        permissionId)) {

            throw new RuntimeException(
                    "Permission already assigned to role"
            );
        }

        RolePermission rolePermission =
                new RolePermission();

        rolePermission.setRoleId(roleId);
        rolePermission.setPermissionId(permissionId);

        return rolePermissionRepository.save(
                rolePermission
        );
    }

    public List<RolePermission> getRolePermissions(
            Long roleId) {

        getRoleById(roleId);

        return rolePermissionRepository.findByRoleId(
                roleId
        );
    }

    @Transactional
    public void removePermission(
            Long roleId,
            Long permissionId) {

        getRoleById(roleId);

        rolePermissionRepository
                .deleteByRoleIdAndPermissionId(
                        roleId,
                        permissionId
                );
    }

    // =========================
    // USER ROLES
    // =========================

    @Transactional
    public UserRole assignRoleToUser(
            Long userId,
            Long roleId,
            Long assignedBy) {

        getRoleById(roleId);

        if (userRoleRepository
                .existsByUserIdAndRoleIdAndStatus(
                        userId,
                        roleId,
                        UserRole.Status.ACTIVE)) {

            throw new RuntimeException(
                    "Role already assigned to user"
            );
        }

        UserRole userRole = new UserRole();

        userRole.setUserId(userId);
        userRole.setRoleId(roleId);
        userRole.setAssignedBy(assignedBy);
        userRole.setStatus(UserRole.Status.ACTIVE);

        return userRoleRepository.save(userRole);
    }

    public List<UserRole> getUserRoles(Long userId) {

        return userRoleRepository.findByUserIdAndStatus(
                userId,
                UserRole.Status.ACTIVE
        );
    }

    @Transactional
    public void revokeRoleFromUser(Long userRoleId) {

        UserRole userRole =
                userRoleRepository.findById(userRoleId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User role assignment not found"
                                )
                        );

        userRole.setStatus(UserRole.Status.REVOKED);
        userRole.setRevokedAt(LocalDateTime.now());

        userRoleRepository.save(userRole);
    }
}