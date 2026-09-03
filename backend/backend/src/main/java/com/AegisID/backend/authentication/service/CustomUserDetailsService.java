package com.AegisID.backend.authentication.service;

import com.AegisID.backend.permission.entity.Permission;
import com.AegisID.backend.permission.repsitory.PermissionRepository;
import com.AegisID.backend.role.entity.Role;
import com.AegisID.backend.role.entity.RolePermission;
import com.AegisID.backend.role.entity.UserRole;
import com.AegisID.backend.role.repsitory.RolePermissionRepository;
import com.AegisID.backend.role.repsitory.RoleRepository;
import com.AegisID.backend.role.repsitory.UserRoleRepository;
import com.AegisID.backend.user.entity.User;
import com.AegisID.backend.user.repository.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;

    public CustomUserDetailsService(
            UserRepository userRepository,
            UserRoleRepository userRoleRepository,
            RoleRepository roleRepository,
            RolePermissionRepository rolePermissionRepository,
            PermissionRepository permissionRepository) {

        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // 1. Find user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found: " + username
                        )
                );

        // 2. Find user's active role assignments
        List<UserRole> userRoles =
                userRoleRepository.findByUserIdAndStatus(
                        user.getId(),
                        UserRole.Status.ACTIVE
                );

        // 3. Convert roles → permissions → authorities
        List<SimpleGrantedAuthority> authorities =
                userRoles.stream()

                        // Get Role
                        .map(userRole ->
                                roleRepository.findById(
                                        userRole.getRoleId()
                                ).orElse(null)
                        )

                        // Ignore missing/inactive roles
                        .filter(role -> role != null)
                        .filter(role ->
                                role.getStatus() == Role.Status.ACTIVE
                        )

                        // Get permissions belonging to each role
                        .flatMap(role ->
                                rolePermissionRepository
                                        .findByRoleId(role.getId())
                                        .stream()
                        )

                        // Get Permission
                        .map(RolePermission::getPermissionId)
                        .map(permissionId ->
                                permissionRepository.findById(
                                        permissionId
                                ).orElse(null)
                        )

                        // Ignore missing/inactive permissions
                        .filter(permission -> permission != null)
                        .filter(permission ->
                                permission.getStatus()
                                        == Permission.Status.ACTIVE
                        )

                        // Convert permission code to Spring authority
                        .map(permission ->
                                new SimpleGrantedAuthority(
                                        permission.getPermissionCode()
                                )
                        )

                        // Remove duplicates
                        .distinct()
                        .toList();

        // 4. Create Spring Security user with authorities
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .build();
    }
}