package com.AegisID.backend.permission.controller;

import com.AegisID.backend.permission.entity.Permission;
import com.AegisID.backend.permission.service.PermissionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(
            PermissionService permissionService) {

        this.permissionService = permissionService;
    }

    @GetMapping
    public List<Permission> getAllPermissions() {
        return permissionService.getAllPermissions();
    }

    @GetMapping("/{id}")
    public Permission getPermission(
            @PathVariable Long id) {

        return permissionService.getPermissionById(id);
    }

    @GetMapping("/code/{code}")
    public Permission getByCode(
            @PathVariable String code) {

        return permissionService.getByCode(code);
    }

    @GetMapping("/module/{module}")
    public List<Permission> getByModule(
            @PathVariable String module) {

        return permissionService.getByModule(module);
    }

    @PostMapping
    public Permission createPermission(
            @RequestBody Permission permission) {

        return permissionService.createPermission(
                permission
        );
    }

    @PutMapping("/{id}")
    public Permission updatePermission(
            @PathVariable Long id,
            @RequestBody Permission permission) {

        return permissionService.updatePermission(
                id,
                permission
        );
    }
}