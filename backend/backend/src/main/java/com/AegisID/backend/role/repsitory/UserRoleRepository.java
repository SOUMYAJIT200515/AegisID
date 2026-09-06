package com.AegisID.backend.role.repsitory;

import com.AegisID.backend.role.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRoleRepository
        extends JpaRepository<UserRole, Long> {

    List<UserRole> findByUserId(Long userId);

    List<UserRole> findByRoleId(Long roleId);

    List<UserRole> findByUserIdAndStatus(
            Long userId,
            UserRole.Status status
    );

    boolean existsByUserIdAndRoleIdAndStatus(
            Long userId,
            Long roleId,
            UserRole.Status status
    );
}