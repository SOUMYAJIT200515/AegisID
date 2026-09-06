package com.AegisID.backend.department.service;

import com.AegisID.backend.department.entity.Department;
import com.AegisID.backend.department.repsitory.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found with id: " + id));
    }

    public List<Department> getDepartmentsByOrganization(Long organizationId) {
        return departmentRepository.findByOrganizationId(organizationId);
    }

    public Department createDepartment(Department department) {

        if (departmentRepository.existsByDepartmentCode(
                department.getDepartmentCode())) {

            throw new RuntimeException("Department code already exists");
        }

        if (departmentRepository.existsByNameAndOrganizationId(
                department.getName(),
                department.getOrganizationId())) {

            throw new RuntimeException(
                    "Department name already exists in this organization");
        }

        return departmentRepository.save(department);
    }

    public Department updateDepartment(
            Long id,
            Department updatedDepartment) {

        Department existingDepartment = getDepartmentById(id);

        if (!existingDepartment.getDepartmentCode()
                .equals(updatedDepartment.getDepartmentCode())
                && departmentRepository.existsByDepartmentCode(
                updatedDepartment.getDepartmentCode())) {

            throw new RuntimeException("Department code already exists");
        }

        existingDepartment.setOrganizationId(
                updatedDepartment.getOrganizationId());

        existingDepartment.setDepartmentCode(
                updatedDepartment.getDepartmentCode());

        existingDepartment.setName(
                updatedDepartment.getName());

        existingDepartment.setDescription(
                updatedDepartment.getDescription());

        existingDepartment.setStatus(
                updatedDepartment.getStatus());

        return departmentRepository.save(existingDepartment);
    }

    public void deleteDepartment(Long id) {

        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException(
                    "Department not found with id: " + id);
        }

        departmentRepository.deleteById(id);
    }
}