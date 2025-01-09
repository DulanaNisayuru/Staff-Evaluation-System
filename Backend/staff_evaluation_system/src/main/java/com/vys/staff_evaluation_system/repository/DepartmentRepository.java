package com.vys.staff_evaluation_system.repository;

import com.vys.staff_evaluation_system.entity.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface DepartmentRepository extends MongoRepository<Department, String> {
    @Query("{ 'dep_name': ?0 }")
    Department findByDep_name(String dep_name);

    // Add custom queries if needed
}
