package com.AegisID.backend.department.repsitory;

import com.AegisID.backend.department.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByDepartmentCode(String departmentCode);

    boolean existsByDepartmentCode(String departmentCode);

    boolean existsByNameAndOrganizationId(String name, Long organizationId);

    List<Department> findByOrganizationId(Long organizationId);
}