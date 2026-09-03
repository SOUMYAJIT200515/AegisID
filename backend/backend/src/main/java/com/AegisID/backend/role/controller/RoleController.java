package com.AegisID.backend.role.controller;

import com.AegisID.backend.role.entity.Role;
import com.AegisID.backend.role.entity.RolePermission;
import com.AegisID.backend.role.entity.UserRole;
import com.AegisID.backend.role.service.RoleService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // =========================
    // ROLE
    // =========================

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    public Role getRole(
            @PathVariable Long id) {

        return roleService.getRoleById(id);
    }

    @GetMapping("/organization/{organizationId}")
    public List<Role> getRolesByOrganization(
            @PathVariable Long organizationId) {

        return roleService.getRolesByOrganization(
                organizationId
        );
    }

    @PostMapping
    public Role createRole(
            @RequestBody Role role) {

        return roleService.createRole(role);
    }

    @PutMapping("/{id}")
    public Role updateRole(
            @PathVariable Long id,
            @RequestBody Role role) {

        return roleService.updateRole(id, role);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteRole(
            @PathVariable Long id) {

        roleService.deleteRole(id);

        return Map.of(
                "success", true,
                "message", "Role deleted successfully"
        );
    }

    // =========================
    // ROLE PERMISSIONS
    // =========================

    @PostMapping("/{roleId}/permissions/{permissionId}")
    public RolePermission assignPermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {

        return roleService.assignPermission(
                roleId,
                permissionId
        );
    }

    @GetMapping("/{roleId}/permissions")
    public List<RolePermission> getRolePermissions(
            @PathVariable Long roleId) {

        return roleService.getRolePermissions(roleId);
    }

    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public Map<String, Object> removePermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {

        roleService.removePermission(
                roleId,
                permissionId
        );

        return Map.of(
                "success", true,
                "message",
                "Permission removed from role"
        );
    }

    // =========================
    // USER ROLES
    // =========================

    @PostMapping("/users/{userId}/roles/{roleId}")
    public UserRole assignRoleToUser(
            @PathVariable Long userId,
            @PathVariable Long roleId,
            @RequestParam(required = false) Long assignedBy) {

        return roleService.assignRoleToUser(
                userId,
                roleId,
                assignedBy
        );
    }

    @GetMapping("/users/{userId}")
    public List<UserRole> getUserRoles(
            @PathVariable Long userId) {

        return roleService.getUserRoles(userId);
    }

    @DeleteMapping("/user-roles/{userRoleId}")
    public Map<String, Object> revokeRole(
            @PathVariable Long userRoleId) {

        roleService.revokeRoleFromUser(
                userRoleId
        );

        return Map.of(
                "success", true,
                "message",
                "Role revoked successfully"
        );
    }
}