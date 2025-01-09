package com.vys.staff_evaluation_system.repository;

import com.vys.staff_evaluation_system.entity.Role;
import com.vys.staff_evaluation_system.entity.User;
import com.vys.staff_evaluation_system.entity.UserProjection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    // Add custom query methods if needed
    Optional<User> findByEmail(String email);
    @Query("{ 'dep_name': ?0 }")
    Optional<User> findByDep_name(String dep_name);

    List<User> findByRole(Role role);

    List<User> findByRoleIn(List<Role> roles);

}

